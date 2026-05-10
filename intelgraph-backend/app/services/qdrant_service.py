import os
from urllib.parse import urlparse
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

def get_qdrant_config():
    qdrant_url = os.getenv("QDRANT_URL", "").strip()
    if qdrant_url:
        parsed = urlparse(qdrant_url if "://" in qdrant_url else f"http://{qdrant_url}")
        return {
            "url": qdrant_url,
            "host": parsed.hostname or "localhost",
            "port": parsed.port or 6333,
        }

    return {
        "url": "",
        "host": os.getenv("QDRANT_HOST", "localhost"),
        "port": int(os.getenv("QDRANT_PORT", 6333)),
    }

class QdrantService:
    def __init__(self):
        self.config = get_qdrant_config()
        self.collection_name = "cyber_intel"
        self.client = None
        self.model = None

    def _init_client(self):
        if not self.client:
            try:
                if self.config["url"]:
                    self.client = QdrantClient(url=self.config["url"])
                else:
                    self.client = QdrantClient(
                        host=self.config["host"],
                        port=self.config["port"],
                    )
            except Exception as e:
                print(f"Warning: Qdrant client failed to connect: {e}")

        if not self.model:
            try:
                self.model = SentenceTransformer("BAAI/bge-large-en-v1.5")
            except Exception:
                # Fallback model
                self.model = SentenceTransformer("all-MiniLM-L6-v2")

    async def retrieve_context(self, query: str, top_k: int = 3) -> str:
        self._init_client()
        
        if not self.client or not self.model:
            return "No context retrieved. Database or model unavailable."

        try:
            vector = self.model.encode(query).tolist()
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=vector,
                limit=top_k
            )
            
            context_blocks = []
            for hit in search_result:
                payload = hit.payload
                if payload and "content" in payload:
                    context_blocks.append(f"- {payload['content']}")
            
            return "\n".join(context_blocks)
        except Exception as e:
            print(f"Error during Qdrant retrieval: {e}")
            return "No context retrieved due to an error."

qdrant_service = QdrantService()
