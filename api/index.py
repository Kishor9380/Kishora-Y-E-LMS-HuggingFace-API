from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from api.hf_api import query_sentiment

# Vercel needs the app variable available in index.py
app = FastAPI(title="LMS Sentiment Analysis API")

# Enable CORS so the React app can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def read_root():
    return {"message": "LMS Backend is running"}

@app.get("/api/sentiment")
async def get_sentiment(text: str = Query(..., description="The feedback text to analyze")):
    """
    FastAPI endpoint that wraps the Hugging Face sentiment analysis API.
    """
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    result = query_sentiment(text)
    
    if isinstance(result, dict) and "error" in result:
        # Check if it's the 503 loading error from HF
        details = result.get("details") or {}
        if details.get("error", "").find("loading") != -1:
             return {"error": "Model is loading, please try again in a few seconds.", "details": details}
        raise HTTPException(status_code=502, detail=result["error"])
        
    # Normalize the output format if necessary (e.g. some models use lowercase)
    if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
        for item in result[0]:
            if "label" in item:
                item["label"] = item["label"].upper()
                
    return result

