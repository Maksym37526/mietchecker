import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const lang = request.nextUrl.searchParams.get('lang') || 'en';

    if (!file) {
      return NextResponse.json(
        { detail: 'No file provided' },
        { status: 400 }
      );
    }

    // Відправляємо до AI сервісу
    const aiFormData = new FormData();
    aiFormData.append('file', file);

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    const response = await fetch(
      `${aiServiceUrl}/analyze?lang=${lang}`,
      {
        method: 'POST',
        body: aiFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { detail: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}