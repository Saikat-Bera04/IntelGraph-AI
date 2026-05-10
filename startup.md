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

Backend values live in `intelgraph-backend/.env`.

```env
# Get this from Google AI Studio
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Qdrant Vector DB Settings
QDRANT_URL=http://localhost:6333

# TigerGraph Savanna / REST++ GraphRAG settings
TIGERGRAPH_URL=https://your-tigergraph-host
TIGERGRAPH_API_KEY=your_tigergraph_api_key
GRAPH_NAME=intelgraph
TIGERGRAPH_VERTEX_TYPES=ThreatActor,Vulnerability,Malware,IP,Sector
```

Frontend values live in `frontend/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_SITE_URL=your_convex_site_url
```

`QDRANT_HOST` and `QDRANT_PORT` are still supported, but `QDRANT_URL` is the preferred single-value setting.

---

## 🧭 3. How To Use The Workflow

1. Start Qdrant if you want live Basic RAG results:
```bash
docker run -p 6333:6333 qdrant/qdrant
```

2. Ingest the starter cybersecurity documents:
```bash
cd "/Applications/Development/IntelGraph AI/intelgraph-backend"
source venv/bin/activate
python scripts/ingest.py
```

3. Start the backend:
```bash
cd "/Applications/Development/IntelGraph AI/intelgraph-backend"
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

4. Start the frontend:
```bash
cd "/Applications/Development/IntelGraph AI/frontend"
npm run dev
```

5. Open `http://localhost:3000/investigation`, enter a threat-intel question, and click **Analyze**.

The frontend posts the query to `NEXT_PUBLIC_API_URL/query`. The backend runs three pipelines:
- `llm_only`: Gemini with no retrieval context.
- `basic_rag`: Gemini plus Qdrant vector context from `cyber_intel`.
- `graphrag`: Gemini plus TigerGraph vertex samples, with a demo fallback if TigerGraph is unavailable.

The Investigation Console then streams the GraphRAG answer, shows the attack graph, compares pipeline metrics, and saves the completed investigation to Convex when configured.

Useful test queries:
- `Which threat actors are linked to Cobalt Strike in healthcare attacks?`
- `Explain the attack chain involving CVE-2023-23397.`
- `What evidence connects APT29 to healthcare targeting?`

---

## 📡 4. API Reference

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

## 🛠️ 5. Tasks You Need to Do (Hackathon Checklist)

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
The Investigation Console (`frontend/app/investigation/page.tsx`) is already wired to `NEXT_PUBLIC_API_URL/query`. If the UI cannot connect, confirm:
1. `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`.
2. The backend is running on port `8000`.
3. `http://localhost:8000/docs` loads in the browser.

---
*Good luck with the hackathon!* 🚀
