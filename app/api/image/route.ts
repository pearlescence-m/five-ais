import { auth } from '@clerk/nextjs'
import { writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'
import { storage } from '@/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

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

    const response = await inference.textToImage({
      model: 'runwayml/stable-diffusion-v1-5',
      inputs: prompt,
      parameters: {
        height: resolution,
        width: resolution,
      },
    })
    console.log(response)
    const buf = await response.arrayBuffer()
    console.log(buf)

    const fileName = `${uuidv4()}.jpeg`
    // const filePath = `public/${fileName}`
    // writeFileSync(filePath, new Uint8Array(buf), {mode: '0777'});
    // console.log(`Done writing image to file ${fileName}`);

    const imageRef = ref(storage, `images/${fileName}`)

    await uploadBytes(imageRef, buf)
    console.log('Uploaded a blob or file!')

    const url = await getDownloadURL(imageRef)
    console.log("image link is ", url)
    return NextResponse.json(url)
    
  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
