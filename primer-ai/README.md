# Primer AI — MVP starter

A child-friendly learning prototype with reading and maths activities, deterministic answer checking, optional Gemini-powered explanations, and a React/Vite frontend backed by Django REST Framework.

## Requirements
- Node.js 20+
- Python 3.11+
- A Gemini API key from Google AI Studio (optional; the app has local fallback feedback)

## Run locally

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Windows: copy .env.example .env
# Add GEMINI_API_KEY to .env if you want Gemini explanations
python manage.py migrate
python manage.py runserver
```

### 2. Frontend (in another terminal)

```bash
cd frontend
npm install
cp .env.example .env  # Windows: copy .env.example .env
npm run dev
```

Open http://localhost:5173.

## Notes
- Gemini API calls happen only in Django; never put the API key in the frontend.
- Answer correctness is decided by the curated activity data, not by the LLM.
- This is a development prototype, not ready for real children's accounts or public launch. Before production, implement parent authentication, object-level authorization, data minimization, rate limiting, privacy/legal review, and proper monitoring.
- For production, configure `CORS_ALLOWED_ORIGINS`, `DEBUG=False`, `SECRET_KEY`, and a production database.
