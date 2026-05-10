import os
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

class QdrantService:
    def __init__(self):
        self.host = os.getenv("QDRANT_HOST", "localhost")
        self.port = int(os.getenv("QDRANT_PORT", 6333))
        self.collection_name = "cyber_intel"
        self.client = None
        self.model = None

    def _init_client(self):
        if not self.client:
            try:
                self.client = QdrantClient(host=self.host, port=self.port)
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
