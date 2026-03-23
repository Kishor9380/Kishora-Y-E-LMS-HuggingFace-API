# Stage 1: Build the React frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Python backend and serve the app
FROM python:3.11-slim
WORKDIR /app

# Copy python requirements and install them
COPY requirements.txt .
# Add aiofiles to serve static files
RUN pip install --no-cache-dir -r requirements.txt aiofiles fastapi uvicorn requests

# Copy Python backend code
COPY api /app/api

# Copy the built React app from Stage 1 into the Python container
COPY --from=frontend-build /app/dist /app/dist

# Expose the port Hugging Face requires
EXPOSE 7860

# Run a dedicated python script that handles both API and Frontend
CMD ["uvicorn", "api.hf_server:hf_app", "--host", "0.0.0.0", "--port", "7860"]
