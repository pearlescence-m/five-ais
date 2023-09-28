import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { HfInference } from '@huggingface/inference'

const inference = new HfInference(process.env.HF_ACCESS_TOKEN)

const instructionMessage = "You are a code generator. You must anwer only in markdown code snippets. Use code comments for explanations."

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!inference) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await inference.textGeneration({
      model: 'tiiuae/falcon-7b-instruct',
      inputs: instructionMessage + " " + messages.content,
      parameters: {
        return_full_text: false,
        max_new_tokens: 1250,
      },
    })

    console.log(instructionMessage + " " + messages.content)

    return NextResponse.json(response)
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};