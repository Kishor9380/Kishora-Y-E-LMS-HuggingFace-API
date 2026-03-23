from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from api.index import app as hf_app
import os

# Serve the built React frontend static files
dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")

# If the dist folder exists (which it will in the Hugging Face Docker container)
if os.path.exists(dist_path):
    hf_app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")

    # Catch-all to support React Router (so refreshing the page doesn't cause a 404)
    @hf_app.exception_handler(404)
    async def custom_404_handler(request, exc):
        return FileResponse(os.path.join(dist_path, "index.html"))
