# IntelGraph AI

**IntelGraph AI** is a GraphRAG-powered cybersecurity investigation platform that analyzes attack chains using multi-hop graph reasoning, dramatically reducing LLM token usage while improving threat intelligence accuracy.

Traditional RAG systems fail in cybersecurity because cyber intelligence is heavily reliant on complex relationships (e.g., `IP → Domain → Malware → CVE → Threat Actor`). Vector search typically retrieves semantically similar text but misses the connected evidence and attack path traversal, resulting in massive token waste and weak attack-chain understanding.

**IntelGraph AI** solves this by fusing GraphRAG, vector search, cyber knowledge graphs, and multi-hop reasoning.

---

## 🌟 Core Features

- **AI Threat Investigation Console**: Extract entities from queries, traverse graph relationships to find connected attack chains, compress evidence, and synthesize final answers with Gemeni 2.5 Flash.
- **Interactive Attack Graph**: Visualize threat actors, malware, IPs, domains, CVEs, and organizations in a dynamic node-based network.
- **Triple-Pipeline Benchmark Engine**: Every query runs concurrently through:
  - **Pipeline 1**: LLM Only
  - **Pipeline 2**: Basic RAG (Vector Embeddings via Qdrant)
  - **Pipeline 3**: GraphRAG (Traversal + Graph Reasoning via TigerGraph)
- **Explainable AI (BERTScore & LLM-as-a-Judge)**: Transparent answer generation detailing the graph traversal path and connected evidence chains.
- **Real-Time Benchmark Dashboard**: See the Token Reduction, Cost Comparison, Latency, and Accuracy Metrics.

---

## 🏗️ Architecture Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS, glassmorphism, Framer Motion
- **Components**: shadcn/ui
- **Graph Visualization**: React Flow

### Backend
- **Framework**: FastAPI (Python)
- **LLM**: Gemini API
- **Vector DB**: Qdrant (Docker)
- **Graph DB**: TigerGraph (Savanna)
- **GraphRAG Framework**: Official TigerGraph GraphRAG Repo
- **Metrics/Evaluation**: tiktoken, bert-score

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Docker (for Qdrant)
- Google AI Studio API Key (Gemini)

### 1. Setup Backend
```bash
# 1. Navigate to backend directory
cd intelgraph-backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install fastapi uvicorn python-dotenv google-generativeai qdrant-client httpx pydantic tiktoken langchain langchain-community sentence-transformers bert-score

# 4. Configure Environment
# Open intelgraph-backend/.env and add:
# GEMINI_API_KEY=your_key
# QDRANT_URL=http://localhost:6333
# TIGERGRAPH_URL=your_restpp_url
# TIGERGRAPH_API_KEY=your_key

# 5. Start the API Server
uvicorn app.main:app --reload --port 8000
```

### 2. Setup Frontend
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The platform will be available at `http://localhost:3000` and the API docs at `http://localhost:8000/docs`.

---

## How To Use

1. Start Qdrant when testing Basic RAG:
```bash
docker run -p 6333:6333 qdrant/qdrant
```

2. Populate the starter vector collection:
```bash
cd intelgraph-backend
source venv/bin/activate
python scripts/ingest.py
```

3. Run the backend and frontend in separate terminals:
```bash
cd intelgraph-backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend
npm run dev
```

4. Open `http://localhost:3000/investigation`, submit a threat-intel question, and review the AI synthesis, evidence chain, attack graph, and pipeline metrics.

The UI calls `POST /query`, which runs LLM-only, Basic RAG, and GraphRAG pipelines together. TigerGraph is used when `TIGERGRAPH_URL`, `TIGERGRAPH_API_KEY`, `GRAPH_NAME`, and `TIGERGRAPH_VERTEX_TYPES` are configured; otherwise, the backend falls back to a demo graph path so the workflow stays usable.

---

## 🛠️ Hackathon Next Steps

To make the platform fully functional for the live demo:
1. **Start Qdrant**: Run `docker run -p 6333:6333 qdrant/qdrant`.
2. **Ingest Vector Data**: Run `python intelgraph-backend/scripts/ingest.py`.
3. **Setup TigerGraph**: Create a TigerGraph Savanna cluster, configure your schema, and link the GraphRAG connector.
4. **Verify Frontend Connection**: Make sure `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000` and the backend docs load at `http://localhost:8000/docs`.

---

*Built for cybersecurity graph intelligence hackathons.*
