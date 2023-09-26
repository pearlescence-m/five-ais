import { auth } from '@clerk/nextjs'
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
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   }
      // ,
      // data: 
      // {
        model: 'stabilityai/stable-diffusion-2-1',
        inputs: prompt,
        parameters: {
          height: imgRes,
          width: imgRes,
        },
      },
      // }
    )
    // const url = URL.createObjectURL(response);
    // const buffer = Buffer.from(await response.arrayBuffer())
    // response.type('Content-Type', response.type)
    // response.setHeader('Content-Length', buffer.length)
    // response.end(buffer)

    // console.log(url)
    return NextResponse.json(response)
  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
