import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    try {
      await limiter.check(5, 'CACHE_TOKEN');
    } catch {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/webm'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported types: MP3, WAV, WebM' },
        { status: 400 }
      );
    }

    // Forward request to model service
    const modelServiceUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:8000';
    const newFormData = new FormData();
    newFormData.append('file', file);

    const response = await fetch(`${modelServiceUrl}/classify`, {
      method: 'POST',
      body: newFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Handle specific error cases
      if (response.status === 400 && error.detail?.includes('Audio must be at least')) {
        return NextResponse.json(
          { error: 'Recording too short. Please record for at least 5 seconds.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.detail || 'Model service error' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Add source type to response
    return NextResponse.json({
      ...result,
      source: file.type.includes('webm') ? 'recording' : 'file'
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}