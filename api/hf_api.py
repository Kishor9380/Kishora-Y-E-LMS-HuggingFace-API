import requests

# We use a list of models as fallback because Hugging Face sometimes deprecates 
# or temporarily takes down specific inference endpoints.
MODELS = [
    "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    "cardiffnlp/twitter-roberta-base-sentiment-latest",
    "lxyuan/distilbert-base-multilingual-cased-sentiments-student"
]

import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Get token from environment variables (Required for Vercel and Hugging Face deployments)
API_TOKEN = os.environ.get("HF_API_TOKEN", "")
headers = {"Authorization": f"Bearer {API_TOKEN}"} if API_TOKEN else {}

def query_sentiment(text):
    """
    Sends a query to Hugging Face Inference API. 
    Tries multiple models if one returns a 410 Gone or 500 error.
    """
    errors = []
    
    for model_id in MODELS:
        url = f"https://router.huggingface.co/hf-inference/models/{model_id}"
        try:
            response = requests.post(url, headers=headers, json={"inputs": text}, timeout=15)
            
            if response.status_code == 200:
                return response.json()
                
            # If 503 Service Unavailable, the model is likely loading
            if response.status_code == 503:
                return {"error": "Model is loading", "details": response.json()}
                
            errors.append(f"{model_id}: {response.status_code} - {response.text}")
            
        except Exception as e:
            errors.append(f"{model_id}: Exception - {str(e)}")
            
    return {"error": f"Analysis failed across all models. Details: {errors}"}

