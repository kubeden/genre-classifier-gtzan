from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
from huggingface_hub import notebook_login

# Login to Hugging Face
notebook_login()

model_path = "./gistilhubert-finetuned-gtzan/checkpoint-1130"

username = "kuberdenis"  
model_name = "kuberdenis-distilhubert-gtzan"
repo_id = f"{username}/{model_name}"

# Load your local model and feature extractor
model = AutoModelForAudioClassification.from_pretrained(model_path)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_path)

# Push to Hub
model.push_to_hub(repo_id)
feature_extractor.push_to_hub(repo_id)

# Add model card metadata
kwargs = {
    "dataset_tags": "marsyas/gtzan",
    "dataset": "GTZAN",
    "model_name": model_name,
    "finetuned_from": "ntu-spml/distilhubert",
    "tasks": "audio-classification",
}

model.push_to_hub(repo_id, **kwargs)

print(f"Model pushed successfully to: https://huggingface.co/{repo_id}")