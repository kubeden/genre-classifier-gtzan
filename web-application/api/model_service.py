from fastapi import FastAPI, UploadFile, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from transformers import pipeline
import librosa
import soundfile as sf
import os
import uuid
import numpy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSIFIER = pipeline("audio-classification", model="kuberdenis/kuberdenis-distilhubert-gtzan")

def process_long_audio(y, sr):
    """Process audio files longer than 1:29"""
    one_minute_samples = int(60 * sr)
    duration_samples = int(29 * sr)
    return y[one_minute_samples:one_minute_samples + duration_samples]

def process_short_audio(y, sr):
    """Process shorter audio files (like recordings)"""
    target_duration = 29  # seconds
    total_duration = len(y) / sr

    if total_duration < 5:  # Minimum length check
        raise HTTPException(
            status_code=400,
            detail="Audio must be at least 5 seconds long"
        )

    if total_duration >= target_duration:
        # Take the middle 29 seconds
        middle_point = len(y) // 2
        half_duration = int(target_duration * sr) // 2
        start = middle_point - half_duration
        end = middle_point + half_duration
        return y[start:end]
    else:
        # If shorter than target duration, loop the audio
        repetitions = int(target_duration / total_duration) + 1
        return numpy.tile(y, repetitions)[:int(target_duration * sr)]

@app.post("/classify")
@limiter.limit("5/minute")
async def classify_audio(request: Request, file: UploadFile):
    try:
        # Create unique temp files
        temp_id = str(uuid.uuid4())
        input_path = f"/tmp/input_{temp_id}.wav"
        processed_path = f"/tmp/processed_{temp_id}.wav"

        # Save uploaded file
        content = await file.read()
        with open(input_path, "wb") as f:
            f.write(content)

        # Process audio
        y, sr = librosa.load(input_path, sr=None)
        total_duration = len(y) / sr

        # Determine if this is a recording or full song
        is_recording = total_duration < 90  # Less than 1:30 implies it's a recording

        try:
            if is_recording:
                y_processed = process_short_audio(y, sr)
            else:
                y_processed = process_long_audio(y, sr)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

        # Save processed file
        sf.write(processed_path, y_processed, sr)
        
        # Use cached classifier
        predictions = CLASSIFIER(processed_path)
        
        return {
            "predictions": predictions,
            "type": "recording" if is_recording else "full_track"
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up temp files
        for path in [input_path, processed_path]:
            if os.path.exists(path):
                os.remove(path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)