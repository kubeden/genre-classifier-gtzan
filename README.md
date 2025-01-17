# Genre Classifier

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)

The following project is a Musical Genre Classification POC. The guide and my thoughts during the whole excercise you can read [here](#). And if you like your content in video form, you can watch the video [here](#).

## Quick Details

The POC consists of:

**Stage 1: Model Work**

- fine-tunning the `ntu-spml/distilhubert` model from HuggingFace
- pushing the model to a personal HuggingFace account
- testing the model locally with `.mp3` files as an input

**Stage 2: Application Work**

- creating a NextJS UI application
- creating an API service, memory-caching the model

**Stage 3: Hosting Work**

- hosting the application & service on a kubernetes cluster

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Kubernetes cluster (for production deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kubeden/genre-classifier.git
cd genre-classifier
```

2. Set up the Python environment:
```bash
python3 -m venv ~/genre-classifier
source ~/genre-classifier/bin/activate
pip install -r requirements-api.txt  # For API service
pip install -r requirements-training.txt  # For model training
```

3. Install UI dependencies:
```bash
cd genre-classifier-ui
npm install
```

## Usage

### Running Locally

1. Start the UI development server:
```bash
cd genre-classifier-ui
npm run dev
```

2. Start the API service:
```bash
python3 model_service.py
```

The application will be available at `http://localhost:3000` (or the port specified in the console output).

### Key Components

- `index.py`: Main training pipeline
- `login_to_huggingface.py`: HuggingFace authentication and model pushing
- `test_model.py`: Local model testing utility
- `model_service.py`: FastAPI server for model inference

## Technology Stack

- **Machine Learning**: Python, HuggingFace Transformers
- **Frontend**: TypeScript, Next.js
- **Backend**: FastAPI, Python
- **Infrastructure**: Kubernetes, Nix
- **Version Control**: Git
- **Model Registry**: HuggingFace

## Documentation

- Blog Post: [Link](#)
- YT Video: [Link](#)
- API documentation: Generated automatically at `/docs` endpoint when running the API service

## Contact

Denislav Gavrilov - [dennis@kubeden.io](mailto:dennis@kubeden.io)

Project Link: [https://github.com/kubeden/genre-classifier-gtzan](https://github.com/kubeden/genre-classifier-gtzan)