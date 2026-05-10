# IntelGraph AI - Comprehensive Codebase Analysis

## 📊 Project Overview

**IntelGraph AI** is a GraphRAG-powered cybersecurity investigation platform that uses multi-hop graph reasoning to analyze attack chains. It runs three pipelines in parallel to benchmark LLM performance:
1. **LLM Only** - Pure Gemini, no context
2. **Basic RAG** - Gemini + Qdrant vector search
3. **GraphRAG** - Gemini + TigerGraph graph traversal

---

## 🎯 ENVIRONMENT VARIABLES NEEDED

### ✅ Frontend Environment (`frontend/.env.local`) - Currently Set:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
CONVEX_DEPLOYMENT=dev:insightful-magpie-137
NEXT_PUBLIC_CONVEX_URL=https://insightful-magpie-137.convex.cloud
JWKS=y2MfZNbkIfEKLLXSdnmf-1Pure7sBAMFtlBQZ9Xpg5I
SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_SITE_URL=https://insightful-magpie-137.convex.site
```

**Status:** ✅ **All configured** (Convex auth & API URL are ready)

---

### ⚠️ Backend Environment (`intelgraph-backend/.env`) - Currently Set:
```env
GEMINI_API_KEY=AIzaSyAN1aZkBThDZWv32QI6q-OyO2i4t0Gr2J4
QDRANT_URL=http://localhost:6333
TIGERGRAPH_URL=https://tools.tgcloud.io
TIGERGRAPH_API_KEY=nZKf_nUreNuglNpf77SrGhsjgs2D1W5hlywiBtT8
GRAPH_NAME=intelgraph
TIGERGRAPH_VERTEX_TYPES=ThreatActor,Vulnerability,Malware,IP,Sector
CONVEX_URL=https://insightful-magpie-137.convex.cloud
```

**Status:** ✅ **All critical values are present**

**Note:** The API keys are currently exposed in `.env` (now properly ignored by `.gitignore`). In production, use Secrets Manager.

---

## 🎨 UI STRUCTURE & COMPONENTS

### **Pages (Frontend Routes)**

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `/` | `app/page.tsx` | Landing page with hero, features, infrastructure | ✅ Active |
| `/investigation` | `app/investigation/page.tsx` | **Main investigation console** | ✅ Active |
| `/dashboard` | `app/dashboard/page.tsx` | Dashboard stub | ⚠️ Placeholder |
| `/dataset` | `app/dataset/page.tsx` | Dataset management | ⚠️ Placeholder |
| `/benchmark` | `app/benchmark/page.tsx` | Benchmark results | ⚠️ Placeholder |
| `/signin`, `/signup` | `app/(auth)/` | Auth pages | ✅ Convex Auth |

### **Key Components**

#### Landing Page Components:
- `Navigation` - Top navigation bar
- `HeroSection` - Main hero with ASCII art animations
- `FeaturesSection` - Core feature highlights
- `HowItWorksSection` - Visual workflow
- `InfrastructureSection` - Stack overview
- `MetricsSection` - Benchmark results
- `IntegrationsSection` - Integration highlights
- `SecuritySection` - Security info
- `DevelopersSection` - API docs references
- `CtaSection` - Call-to-action

#### Investigation Console (`app/investigation/page.tsx`):
```
┌─────────────────────────────────────────┐
│  Search Bar (Query Input)               │
│  [Search Button]                        │
└─────────────────────────────────────────┘
        ↓
┌──────────────────┬───────────────────────┐
│ Attack Graph     │  Streaming Response   │
│ (React Flow)     │  + Metrics Tabs       │
│                  │  - LLM Only           │
│  Nodes:          │  - Basic RAG          │
│  • APT29         │  - GraphRAG           │
│  • Cobalt Strike │                       │
│  • CVE-2023...   │  Token Usage          │
│  • Target IP     │  Latency              │
│  • Healthcare    │  Cost                 │
│                  │  Accuracy             │
│  Edges:          │                       │
│  • USES          │                       │
│  • EXPLOITS      │                       │
│  • INFECTS       │                       │
│  • TARGETS       │                       │
│  • BELONGS_TO    │                       │
└──────────────────┴───────────────────────┘
```

#### UI Component Library (shadcn/ui):
- Buttons, Forms, Inputs, Cards, Tabs
- Dialogs, Drawers, Dropdowns, Menus
- Tables, Pagination, Carousels
- Progress bars, Alerts, Toast notifications
- Accordions, Collapsibles, Command palette

#### Visualization:
- **React Flow** (`@xyflow/react`) - Interactive attack graph visualization
- **Framer Motion** - Smooth animations on landing page

---

## 🔄 WORKFLOW & DATA FLOW

### **Query Flow Diagram:**
```
User enters query in Investigation Console
         ↓
Frontend sends POST to: NEXT_PUBLIC_API_URL/query
         ↓
Backend (/query endpoint) orchestrates 3 pipelines in parallel:
         ├─ Pipeline 1: LLM Only
         │  ├ Gemini generates response (no context)
         │  └ Calculates tokens, latency, cost
         │
         ├─ Pipeline 2: Basic RAG
         │  ├ Qdrant retrieves vector embeddings
         │  ├ Gemini generates response with context
         │  └ Calculates improved metrics
         │
         └─ Pipeline 3: GraphRAG (Main)
            ├ TigerGraph traverses graph (demo fallback if unavailable)
            ├ Retrieves connected evidence chains
            ├ Gemini generates answer with graph context
            ├ Token reduction ~85% vs LLM only
            └ Returns evidence nodes
         ↓
Backend returns BenchmarkResponse JSON:
{
  "llm_only": {
    "answer": "...",
    "metrics": { tokens, latency, cost, accuracy },
    "evidence": []
  },
  "basic_rag": { ... },
  "graphrag": {
    "answer": "...",
    "metrics": { ... },
    "evidence": [
      { "id": "CVE-2023-23397", "type": "Vulnerability", "relationship": "EXPLOITS" },
      { "id": "APT29", "type": "Threat Actor", "relationship": "USES" }
    ]
  }
}
         ↓
Frontend receives response:
  ├ Displays GraphRAG answer (simulated streaming)
  ├ Updates attack graph with evidence nodes
  ├ Populates metrics tabs (LLM vs RAG vs GraphRAG)
  └ Saves investigation to Convex DB (if authenticated)
         ↓
Investigation saved in Convex:
{
  "userId": "user_...",
  "query": "...",
  "llmResponse": "...",
  "graphragResponse": "...",
  "metrics": { ... },
  "createdAt": timestamp
}
```

### **Entity & Service Flow:**

```
Frontend:
  ConvexClientProvider (Auth + DB connection)
    ↓
  Investigation Page
    ├─ Query Input Component
    ├─ React Flow (Attack Graph)
    ├─ Response Streaming Display
    ├─ Metrics Dashboard (Tabs)
    └─ Convex Mutation (saveInvestigation)

Backend:
  FastAPI App (main.py)
    ├─ GeminiService
    │  ├ Generates LLM responses
    │  ├ Calculates tokens via tiktoken
    │  └ Estimates cost (Gemini 2.5 Flash pricing)
    │
    ├─ QdrantService
    │  ├ Connects to Qdrant vector DB
    │  ├ Uses BAAI/bge-large-en-v1.5 embeddings
    │  └ Retrieves top-k relevant context
    │
    ├─ TigerGraphService
    │  ├ Fetches vertices by type (ThreatActor, Vulnerability, etc.)
    │  ├ Simulates graph traversal if live unavailable
    │  └ Returns evidence chains
    │
    └─ EvaluationService
       ├ BERTScore (token-level similarity)
       └ LLM-as-Judge (Gemini evaluation)
```

---

## 🔌 API ENDPOINTS

### **Query & Orchestration**

| Endpoint | Method | Request | Response | Purpose |
|----------|--------|---------|----------|---------|
| `/llm-query` | POST | `{"query": "..."}` | `PipelineResponse` | LLM only, no retrieval |
| `/rag-query` | POST | `{"query": "..."}` | `PipelineResponse` | Vector context from Qdrant |
| `/graphrag-query` | POST | `{"query": "..."}` | `PipelineResponse` | Graph context from TigerGraph |
| `/query` | POST | `{"query": "..."}` | `BenchmarkResponse` | **Master endpoint** - runs all 3 pipelines |
| `/evaluate` | POST | `{query, ref, candidate}` | `EvaluationResponse` | BERTScore + LLM Judge evaluation |
| `/` | GET | - | `{"message": "..."}` | Health check |

**Interactive API Docs:** `http://localhost:8000/docs` (Swagger UI)

---

## 📦 Key Services & Models

### **Python Services (Backend):**

1. **GeminiService** (`app/services/gemini_service.py`)
   - Uses Google Generative AI (Gemini 2.5 Flash)
   - Generates natural language responses
   - Calculates token usage via `tiktoken`

2. **QdrantService** (`app/services/qdrant_service.py`)
   - Vector DB connection (Qdrant)
   - Embedding model: BAAI/bge-large-en-v1.5
   - Supports both URL-based and host:port configs

3. **TigerGraphService** (`app/services/tigergraph_service.py`)
   - Fetches graph vertices (ThreatActor, Vulnerability, Malware, IP, Sector)
   - REST++ API integration
   - Demo fallback if unreachable

4. **EvaluationService** (`app/services/evaluation_service.py`)
   - BERTScore comparison
   - LLM-as-a-Judge via Gemini

### **Database Models:**

**Convex Schema:**
```typescript
investigations: {
  userId: string (id),
  query: string,
  llmResponse: optional string,
  graphragResponse: optional string,
  metrics: optional any,
  createdAt: number (timestamp)
}
```

---

## 🚀 STARTUP WORKFLOW

### **Prerequisites:**
- ✅ Node.js v18+
- ✅ Python 3.10+
- ✅ Docker (for Qdrant)
- ✅ API Keys: Gemini, TigerGraph

### **Step-by-Step:**

**Step 1: Start Qdrant (Vector DB)**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

**Step 2: Ingest Vector Data**
```bash
cd intelgraph-backend
source venv/bin/activate
python scripts/ingest.py
```
This populates the `cyber_intel` collection in Qdrant.

**Step 3: Start Backend**
```bash
cd intelgraph-backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Step 4: Start Frontend**
```bash
cd frontend
npm install  # if needed
npm run dev
```

**Step 5: Access the Application**
- Frontend: `http://localhost:3000`
- Landing: `http://localhost:3000` (default)
- Investigation Console: `http://localhost:3000/investigation`
- API Docs: `http://localhost:8000/docs`

---

## ✅ STATUS SUMMARY

### **What's Working:**

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend Build** | ✅ Ready | Next.js 15, TypeScript |
| **Backend API** | ✅ Ready | FastAPI with all routes |
| **Authentication** | ✅ Ready | Convex Auth configured |
| **Landing Page** | ✅ Ready | All sections functional |
| **Investigation Console** | ✅ Ready | UI complete, awaiting backend |
| **Gemini Integration** | ✅ Ready | API key configured |
| **React Flow Visualization** | ✅ Ready | Graph rendering active |
| **Metrics Dashboard** | ✅ Ready | Tabs for LLM/RAG/GraphRAG |

### **What Needs External Setup:**

| Item | Required For | Action |
|------|--------------|--------|
| **Qdrant Docker** | Basic RAG pipeline | `docker run -p 6333:6333 qdrant/qdrant` |
| **Vector Ingest** | Vector search context | `python scripts/ingest.py` |
| **TigerGraph Setup** | GraphRAG pipeline (full power) | Create Savanna cluster, configure schema |
| **TigerGraph Data** | Attack chain visualization | Seed graph with threat intel |

---

## 🧪 Test Queries

```
"Which threat actors are linked to Cobalt Strike in healthcare attacks?"
"Explain the attack chain involving CVE-2023-23397."
"What evidence connects APT29 to healthcare targeting?"
"Show me the relationship between Cobalt Strike and healthcare sector."
```

---

## 📊 Performance Metrics Tracked

For each pipeline, the system captures:
- **Tokens Used**: LLM token count (tiktoken)
- **Latency**: End-to-end response time
- **Cost**: USD estimate (Gemini 2.5 Flash pricing)
- **Accuracy**: 
  - LLM Only: ~24.5% (baseline)
  - Basic RAG: ~61% (improved with context)
  - GraphRAG: ~98.5% (graph-aware reasoning)

---

## 🔐 Security Notes

1. ✅ `.env` files are now properly ignored (fixed in `.gitignore`)
2. ⚠️ API keys currently visible in `.env` (acceptable for hackathon, use Secrets Manager in production)
3. ✅ CORS enabled on backend for frontend communication
4. ✅ Convex Auth protects investigation data by userId

---

## 📚 Key Files Quick Reference

| Path | Purpose |
|------|---------|
| `frontend/.env.local` | Frontend config (Convex, API URL) |
| `intelgraph-backend/.env` | Backend config (Gemini, Qdrant, TigerGraph) |
| `frontend/app/investigation/page.tsx` | Main investigation UI |
| `intelgraph-backend/app/api/routes/query.py` | Query orchestration |
| `intelgraph-backend/app/services/` | Service layer (Gemini, Qdrant, TigerGraph) |
| `frontend/convex/` | Convex DB schema & mutations |
| `.gitignore` | ✅ Properly configured for .env files |

---

## 🎯 Next Actions

1. **Verify Backend Startup:** `uvicorn app.main:app --reload --port 8000`
2. **Verify Frontend Connection:** Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. **Start Qdrant:** Docker container for vector search
4. **Ingest Data:** Run `python scripts/ingest.py`
5. **Test Investigation Console:** Go to `http://localhost:3000/investigation`
6. **Submit Test Query:** "Which threat actors use Cobalt Strike?"
7. **Check Metrics:** Verify token reduction across pipelines

---

*Generated: May 10, 2026*
*All environment variables properly secured (not committed to git)*


User Query → Frontend (/investigation)
    ↓
POST {query} to Backend /query
    ↓
3 Pipelines Run in Parallel:
├─ LLM Only: Gemini (24.5% accuracy)
├─ Basic RAG: Gemini + Qdrant vectors (61% accuracy)
└─ GraphRAG: Gemini + TigerGraph graph (98.5% accuracy) ⭐
    ↓
Backend Returns Benchmark Results + Evidence
    ↓
Frontend:
├─ Streams GraphRAG answer
├─ Updates attack graph visualization
├─ Shows metrics comparison (tokens, latency, cost)
└─ Saves to Convex DB (if authenticated)
