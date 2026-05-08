import { NextRequest, NextResponse } from 'next/server';
import { callVolcEngineAI } from '../../../lib/volcEngineClient';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, prompt } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64 parameter' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt parameter' }, { status: 400 });
    }

    const accessKeyId = process.env.VOLC_ACCESS_KEY_ID;
    const secretAccessKey = process.env.VOLC_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 });
    }

    const result = await callVolcEngineAI(imageBase64, prompt, accessKeyId, secretAccessKey);

    if (result.success && result.imageUrl) {
      return NextResponse.json({ success: true, imageUrl: result.imageUrl });
    } else {
      return NextResponse.json(
        { success: false, error: result.error, message: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI optimization error:', error);
    return NextResponse.json(
      {
        error: 'AI optimization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
