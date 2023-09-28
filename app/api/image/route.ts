import { auth } from '@clerk/nextjs'
import { writeFileSync } from "fs";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const inference = new HfInference(process.env.HF_ACCESS_TOKEN)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, resolution } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 })
    }

    if (!resolution) {
      return new NextResponse('Resolution is required', { status: 400 })
    }

    const imgRes = Number(resolution.split('x')[0])

    const response = await inference.textToImage({
      model: 'runwayml/stable-diffusion-v1-5',
      inputs: prompt,
      parameters: {
        height: imgRes,
        width: imgRes,
      },
    })
    
    const buf = await response.arrayBuffer();
    console.log(response.type)
    const fileName = `${uuidv4()}.jpeg`;
    const filePath = `public/${fileName}`
    writeFileSync(filePath, new Uint8Array(buf), {mode: '0777'});
    console.log(`Done writing image to file ${fileName}`);

    // const resp = NextResponse.json(buffer)
    // resp.headers.set('Content-Type', response.type)
    // resp.headers.set('Content-Length', String(buffer.length))
    // console.log(resp)

    return NextResponse.json(fileName)
  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
