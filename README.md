# Genre Classifier

The following project is a Musical Genre Classification POC.

The guide and thoughts on the whole excercise you can read [here](#).

And if you like your content in video form, you can watch the video [here](#).

### Details & Involved Technologies:

#### Details

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

#### Involved Technologies

**Technologies used:**

- Python
- Typescript (NextJS)
- Kubernetes
- Nix
- Git
- HuggingFace

> All required libraries for the training part are in the `requirements-training.txt` file.

> And the required libraries for the API service are in the `requirements-api.txt` file.

## More Information

### Scripts

- **index.py:** main training logic
- **login_to_huggingface.py:** login and push the model to huggingface
- **test_model.py:** test the model locally with an .mp3 input
- **model_service.py:** start a `fastapi` server for model inference

### UI

The `genre-classifier-ui` contains a simple NextJS frontend.

To start the UI, do the following:

```
cd genre-classifier-ui
npm install
npm run dev
```

You will get an output with the localhost:port, CTRL + right click to open the web page.

### Running The Whole Application

To run the complete solution locally, do the following:

```
# open two terminnal windows / tabs

# window one:
cd genre-classifier-ui
npm install
npm run dev

# window two:
python3 -m venv ~/genre-classifier
pip install -r ./requirements-api.txt
python3 model_service.py
```