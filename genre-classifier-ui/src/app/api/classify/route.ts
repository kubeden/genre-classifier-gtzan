import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

// Create a rate limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max number of unique users per interval
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    try {
      await limiter.check(5, 'CACHE_TOKEN'); // 5 requests per minute
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
      return NextResponse.json(
        { error: error.detail || 'Model service error' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}