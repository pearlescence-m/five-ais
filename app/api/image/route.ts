import { auth } from '@clerk/nextjs'
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

    const buf = await response.arrayBuffer()

    const fileName = `${uuidv4()}.jpeg`
    const imageRef = ref(storage, `images/${fileName}`)

    await uploadBytes(imageRef, buf)
    const url = await getDownloadURL(imageRef)

    return NextResponse.json(url)
    
  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
