# Next Step Roadmap After Frontend

You already completed:
✅ Frontend

Now your goal is:

> Make the backend actually prove GraphRAG beats Basic RAG.

That’s the entire hackathon.

---

# FINAL BACKEND STACK

| Layer           | Tech                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| Backend API     | [FastAPI](https://fastapi.tiangolo.com/?utm_source=chatgpt.com)                           |
| LLM             | [Gemini API](https://ai.google.dev/?utm_source=chatgpt.com)                               |
| Vector DB       | [Qdrant](https://qdrant.tech/?utm_source=chatgpt.com)                                     |
| Graph DB        | [TigerGraph](https://www.tigergraph.com/?utm_source=chatgpt.com)                          |
| GraphRAG        | [TigerGraph GraphRAG Repo](https://github.com/tigergraph/graphrag?utm_source=chatgpt.com) |
| Realtime/App DB | [Convex](https://www.convex.dev/?utm_source=chatgpt.com)                                  |

---

# MASTER PLAN

You will build backend in THIS order:

---

# PHASE 1 — Backend Foundation

# Step 1 — Create FastAPI Project

## Install

```bash
mkdir intelgraph-backend
cd intelgraph-backend

python -m venv venv
```

Activate:

### Mac/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install fastapi uvicorn python-dotenv google-generativeai qdrant-client httpx pydantic tiktoken
```

Also install:

```bash
pip install langchain langchain-community sentence-transformers
```

---

# Step 2 — Backend Structure

Create:

```text id="24b7ka"
backend/
│
├── app/
│   ├── api/
│   ├── services/
│   ├── rag/
│   ├── graphrag/
│   ├── metrics/
│   ├── models/
│   ├── utils/
│   └── main.py
│
├── datasets/
├── scripts/
├── tests/
├── .env
└── requirements.txt
```

---

# Step 3 — Setup FastAPI

# `main.py`

```python id="82c0vd"
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "IntelGraph Backend Running"}
```

Run:

```bash
uvicorn app.main:app --reload
```

---

# PHASE 2 — Gemini Integration

# Step 4 — Gemini Setup

Get API key:

* [Google AI Studio](https://aistudio.google.com/?utm_source=chatgpt.com)

---

# `.env`

```env id="gnjlwm"
GEMINI_API_KEY=your_key
```

---

# Gemini Service

Create:

```text id="e1m9ln"
app/services/gemini_service.py
```

---

# Example

```python id="0s6qfk"
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
```

---

# PHASE 3 — Build Pipeline 1 (LLM Only)

# Step 5 — LLM Pipeline

Flow:

```text id="c2d9rk"
Query → Gemini → Response
```

This becomes your baseline.

---

# API

```http id="ye83qe"
POST /llm-query
```

Input:

```json id="10xhvd"
{
  "query": "Which groups exploited Log4Shell?"
}
```

---

# PHASE 4 — Build Basic RAG

# Step 6 — Setup Qdrant

Install Docker.

Run:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

---

# Step 7 — Embedding Model

Use:

* BAAI/bge-large-en-v1.5

---

# Step 8 — Ingestion Pipeline

Create:

```text id="0t4a2f"
scripts/ingest.py
```

This script:

1. loads cyber documents
2. chunks text
3. generates embeddings
4. stores vectors in Qdrant

---

# Step 9 — Build Basic RAG API

Flow:

```text id="l6g4o3"
Query
 ↓
Embedding
 ↓
Qdrant Search
 ↓
Top Chunks
 ↓
Gemini
 ↓
Answer
```

---

# PHASE 5 — GraphRAG Setup

THIS is the important part.

---

# Step 10 — Clone TigerGraph GraphRAG

```bash
git clone https://github.com/tigergraph/graphrag.git
```

Required by hackathon. 

---

# Step 11 — Setup TigerGraph

Use:

* [TigerGraph Savanna](https://tgcloud.io/?utm_source=chatgpt.com)

Create:

* cluster
* graph
* credentials

---

# Step 12 — Configure GraphRAG

Inside GraphRAG repo:

* add Gemini API key
* connect TigerGraph
* configure ingestion

---

# Step 13 — Ingest Dataset into Graph

Load:

* CVEs
* MITRE ATT&CK
* threat reports
* malware docs

GraphRAG automatically:

* extracts entities
* builds graph
* creates relationships

---

# Step 14 — GraphRAG Query API

Flow:

```text id="m7v5z6"
Query
 ↓
Entity Detection
 ↓
Graph Traversal
 ↓
Multi-Hop Reasoning
 ↓
Context Compression
 ↓
Gemini
 ↓
Answer
```

This is your killer feature.

---

# PHASE 6 — Metrics Engine

# Step 15 — Track Tokens

Track:

* prompt tokens
* completion tokens

Use:

* tiktoken

---

# Step 16 — Track Latency

```python id="tln1mw"
start = time.time()
```

```python id="h2cxic"
end = time.time()
```

---

# Step 17 — Cost Calculation

Formula:

\text{Cost} = \left(\frac{\text{tokens}}{1,000,000}\right) \times \text{model pricing}

---

# PHASE 7 — Benchmark API

# Step 18 — Main Endpoint

# `POST /query`

This endpoint:

1. runs all 3 pipelines
2. compares outputs
3. returns metrics

---

# Response Structure

```json id="1rzmbn"
{
  "llm_only": {},
  "basic_rag": {},
  "graphrag": {},
  "metrics": {
    "tokens": {},
    "latency": {},
    "cost": {},
    "accuracy": {}
  }
}
```

---

# PHASE 8 — Frontend Integration

# Step 19 — Connect Frontend

Your frontend:

* sends query
* receives:

  * 3 responses
  * metrics
  * graph nodes
  * attack chains

---

# PHASE 9 — Accuracy Evaluation

# Step 20 — BERTScore

Install:

```bash
pip install bert-score
```

---

# Step 21 — LLM-as-a-Judge

Prompt:

```text id="mbsgh6"
Compare generated answer with reference answer.

Return:
- PASS or FAIL
- reasoning
- confidence
```

Required by hackathon. 

---

# IMPORTANT

# DO NOT BUILD EVERYTHING TOGETHER

Biggest mistake.

Instead:

---

# BUILD ORDER

## Week 1

### Build:

* FastAPI
* Gemini
* LLM-only

---

## Week 2

### Build:

* Basic RAG
* Qdrant
* embeddings

---

## Week 3

### Build:

* TigerGraph
* GraphRAG
* graph traversal

---

## Week 4

### Build:

* metrics dashboard
* evaluations
* demo polish

---

# BACKEND MASTER PROMPT

Use this in:

* Cursor
* Claude Code
* GPT-5 coding agent

---

```text id="2v80r0"
Build a production-grade FastAPI backend for IntelGraph AI, a GraphRAG-powered cybersecurity investigation platform.

Architecture Requirements:
- Modular FastAPI architecture
- Async APIs
- Service-oriented structure
- Production-ready code organization
- Environment-based config
- Logging
- Error handling

Features:
1. LLM-only pipeline
2. Basic vector RAG pipeline
3. TigerGraph GraphRAG pipeline
4. Query orchestration engine
5. Benchmark comparison engine
6. Token tracking
7. Latency tracking
8. Cost calculation
9. BERTScore evaluation
10. LLM-as-a-Judge evaluation

Integrations:
- Gemini 2.5 Flash
- Qdrant vector database
- TigerGraph GraphRAG
- Convex
- React Flow compatible graph APIs

Endpoints:
POST /query
POST /llm-query
POST /rag-query
POST /graphrag-query
GET /metrics
GET /graph/{query}
GET /entities/{id}

Requirements:
- streaming responses
- async processing
- clean architecture
- typed schemas
- scalable services
- benchmark metrics
- cyber intelligence graph traversal
- graph compression layer
- source citations
- token optimization

Dataset Domain:
Cybersecurity threat intelligence including:
- CVEs
- MITRE ATT&CK
- malware reports
- threat actor infrastructure
- ransomware campaigns

The backend should support:
- multi-hop graph reasoning
- attack chain analysis
- evidence correlation
- graph-based context compression

Goal:
Demonstrate that GraphRAG reduces tokens and latency while maintaining or improving answer accuracy compared to Basic RAG.
```
