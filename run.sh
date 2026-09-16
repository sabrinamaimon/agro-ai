#!/bin/bash
echo "🌾 Starting Agro-AI Field Intelligence Platform..."
cd "$(dirname "$0")"

# Activate Python venv and start FastAPI backend
echo "🚀 Launching FastAPI Backend on http://localhost:8000..."
./venv/bin/python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start React Frontend
echo "💻 Launching React Frontend on http://localhost:5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
