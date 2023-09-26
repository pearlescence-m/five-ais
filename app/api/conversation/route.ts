import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const inference = new HfInference(process.env.HF_ACCESS_TOKEN)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!inference) {
      return new NextResponse('API Key not configured.', { status: 500 })
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const response = await inference.textGeneration({
      model: 'tiiuae/falcon-7b-instruct',
      inputs: messages.content,
      parameters: {
        return_full_text: false,
        max_new_tokens: 1250,
      },
    })
    return NextResponse.json(response)
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
