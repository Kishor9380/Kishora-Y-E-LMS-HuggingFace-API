<div align="center">
  <h1>🎓 LMS Artificial Intelligence Assistant</h1>
  <p>A full-stack Learning Management System featuring real-time AI student feedback analysis using Hugging Face Transformer models.</p>
</div>

---

## 🌟 Overview
**KodHub LMS** is a modern, interactive e-learning platform equipped with intelligent sentiment analysis. Built with React (Vite) on the frontend and FastAPI on the backend, it seamlessly integrates Hugging Face's advanced Natural Language Processing (NLP) models to help course creators instantly understand student feedback.

## ✨ Key Features
* 🤖 **AI Feedback Analysis**: Evaluates student feedback instantly using the `distilbert-base-uncased-finetuned-sst-2-english` model.
* ⚡ **Ultra-Fast Backend**: Powered by FastAPI, ensuring low latency between the UI and NLP models.
* 🎨 **Premium UI/UX**: Designed with modern glassmorphism aesthetics, responsive layouts, and micro-animations.
* 🛡️ **Robust Fallback Engine**: Multi-model fallback logic ensuring 99.9% uptime for AI evaluations.
* 🚀 **Serverless Ready**: Fully optimized for deployment on Vercel (React + Python Serverless) and Hugging Face Spaces (Docker).

## 🛠️ Technology Stack
### Frontend
* **React 18** (Vite + SWC)
* **Tailwind-inspired Vanilla CSS** (Custom Design System)
* **Lucide React** (Dynamic Iconography)
* **React Router Dom** (Client-side routing)

### Backend
* **Python 3.11**
* **FastAPI** (High-performance API framework)
* **Uvicorn** (ASGI Web Server)
* **Hugging Face Inference API** (Transformer Models)

---

## 🚦 Getting Started Locally

### Prerequisites
Make sure you have Node.js (v18+) and Python (v3.10+) installed.

### 1. Clone the repository
```bash
git clone https://github.com/Kishor9380/Kishora-Y-E-LMS-HuggingFace-API.git
cd Kishora-Y-E-LMS-HuggingFace-API
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Hugging Face API token:
```env
HF_API_TOKEN=your_hugging_face_token_here
```

### 3. Start the Backend (FastAPI)
Open a terminal in the project root:
```bash
pip install -r requirements.txt
uvicorn api.index:app --host 0.0.0.0 --port 8000
```
*The API will be running at `http://localhost:8000`*

### 4. Start the Frontend (Vite)
Open a **new** terminal in the project root:
```bash
npm install
npm run dev
```
*The web app will be running at `http://localhost:5173`*

---

## 🌐 Deployment Guides

### Deploying to Vercel (Recommended)
This project is configured out-of-the-box for Vercel Serverless deployment.
1. Import the repository into your Vercel Dashboard.
2. In the project settings, add the `HF_API_TOKEN` environment variable.
3. Click **Deploy**. Vercel will automatically bundle the Vite frontend and host the Python API.

### Deploying to Hugging Face Spaces (Docker)
This project includes a custom `Dockerfile` serving both React and FastAPI.
1. Create a new **Docker** Space on Hugging Face.
2. Link your GitHub repository.
3. Go to Space Settings -> Variables and Secrets. Add an `HF_API_TOKEN` secret.
4. Hugging Face will build the Docker container and expose the app on port `7860`.

---
<div align="center">
  <p>Built with ❤️ for modern education by Kishora Y E.</p>
</div>
