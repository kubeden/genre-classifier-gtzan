from fastapi import FastAPI, UploadFile, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from transformers import pipeline
import librosa
import soundfile as sf
import os
import uuid
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI and rate limiter
app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache the model in memory
CLASSIFIER = pipeline("audio-classification", model="kuberdenis/kuberdenis-distilhubert-gtzan")

@app.post("/classify")
@limiter.limit("5/minute")
async def classify_audio(request: Request, file: UploadFile):  # Added request parameter
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
        
        # Calculate sample positions
        one_minute_samples = int(60 * sr)
        duration_samples = int(29 * sr)
        
        if len(y) < one_minute_samples + duration_samples:
            raise HTTPException(
                status_code=400,
                detail="Audio file must be at least 1 minute and 29 seconds long"
            )
        
        # Get the segment from 1:00 to 1:29
        y_trimmed = y[one_minute_samples:one_minute_samples + duration_samples]
        
        # Save processed file
        sf.write(processed_path, y_trimmed, sr)
        
        # Use cached classifier
        predictions = CLASSIFIER(processed_path)
        
        return {"predictions": predictions}
            
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