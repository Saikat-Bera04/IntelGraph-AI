# IntelGraph AI - Startup Guide

Welcome to IntelGraph AI! This guide covers everything you need to get both the frontend and backend running, the available API endpoints, and the manual tasks you need to complete for the hackathon.

---

## 🚀 1. Quick Start

You need to run two servers simultaneously: the Next.js Frontend and the FastAPI Backend.

### Terminal 1: Run the Frontend
```bash
cd "/Applications/Development/IntelGraph AI/frontend"
npm install   # If you haven't already
npm run dev
```
*Frontend will be available at: http://localhost:3000*

### Terminal 2: Run the Backend
```bash
cd "/Applications/Development/IntelGraph AI/intelgraph-backend"
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
*Backend API docs will be available at: http://localhost:8000/docs*

---

## ⚙️ 2. Environment Variables

Navigate to `intelgraph-backend/.env` and update your keys.

```env
# Get this from Google AI Studio
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Qdrant Vector DB Settings (Default local docker ports)
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

---

## 📡 3. API Reference

The FastAPI backend exposes the following endpoints (You can test them interactively at `http://localhost:8000/docs`):

### Query & Orchestration
- **`POST /llm-query`**: Runs the baseline LLM pipeline (no context).
- **`POST /rag-query`**: Runs the Basic RAG pipeline (fetches vector context from Qdrant).
- **`POST /graphrag-query`**: Runs the GraphRAG pipeline (simulated graph traversal & compression).
- **`POST /query`**: **The Master Endpoint.** Orchestrates all 3 pipelines side-by-side and returns the unified `BenchmarkResponse` containing exact tokens, latency, cost, and accuracy metrics for each pipeline.

### Evaluation & Metrics
- **`POST /evaluate`**: Accepts a `query`, `reference_answer`, and `candidate_answer`. It runs both **BERTScore** and **LLM-as-a-Judge** (via Gemini) to evaluate accuracy and returns the metrics.

*(Note: The request payload for all query endpoints is `{"query": "your question"}`)*

---

## 🛠️ 4. Tasks You Need to Do (Hackathon Checklist)

To make the simulated components fully live and functional, you must complete these external setup tasks:

### Task 1: Start Qdrant (Basic RAG Database)
You need to run Qdrant locally via Docker to make the `/rag-query` endpoint and `scripts/ingest.py` work.
```bash
# Run this in any terminal
docker run -p 6333:6333 qdrant/qdrant
```

### Task 2: Ingest Vector Data
Once Qdrant is running, populate it with your cybersecurity datasets.
```bash
cd "/Applications/Development/IntelGraph AI/intelgraph-backend"
source venv/bin/activate
python scripts/ingest.py
```

### Task 3: Setup TigerGraph (GraphRAG Database)
This is your killer feature. You need to configure TigerGraph manually:
1. Go to **TigerGraph Savanna** (tgcloud.io) and create a free tier cluster.
2. Create a graph schema containing: `ThreatActor`, `Vulnerability`, `Malware`, `IP`, `Sector`.
3. Configure the GraphRAG connector inside the `intelgraph-backend/graphrag` folder (which we cloned earlier) with your Savanna credentials.

### Task 4: Connect the Frontend to the Backend
Currently, the Investigation Console (`frontend/app/investigation/page.tsx`) uses a simulated response timer. You need to:
1. Add a `fetch('http://localhost:8000/query', { method: 'POST', body: JSON.stringify({ query }) })` call inside the `handleSearch` function.
2. Map the backend's real `BenchmarkResponse` metrics to the React state to update the UI charts dynamically!

---
*Good luck with the hackathon!* 🚀
