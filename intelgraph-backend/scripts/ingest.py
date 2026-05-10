import os
import json
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# Initialize models and client
print("Loading Embedding Model...")
try:
    model = SentenceTransformer("BAAI/bge-large-en-v1.5")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback to a smaller model for hackathon if large fails
    model = SentenceTransformer("all-MiniLM-L6-v2")

def get_qdrant_client():
    qdrant_url = os.getenv("QDRANT_URL", "").strip()
    if qdrant_url:
        return QdrantClient(url=qdrant_url), qdrant_url

    qdrant_host = os.getenv("QDRANT_HOST", "localhost")
    qdrant_port = int(os.getenv("QDRANT_PORT", 6333))
    return QdrantClient(host=qdrant_host, port=qdrant_port), f"{qdrant_host}:{qdrant_port}"

qdrant_target = os.getenv("QDRANT_URL", "").strip() or "localhost:6333"

try:
    client, qdrant_target = get_qdrant_client()
except Exception as e:
    print(f"Failed to connect to Qdrant at {qdrant_target}: {e}")
    print("Please make sure Qdrant is running via Docker.")
    exit(1)

COLLECTION_NAME = "cyber_intel"

# Sample Mock Data
cyber_docs = [
    {
        "id": "doc1",
        "content": "APT29, also known as Cozy Bear, has been observed targeting healthcare organizations using the Cobalt Strike framework.",
        "type": "threat_report"
    },
    {
        "id": "doc2",
        "content": "CVE-2023-23397 is an elevation of privilege vulnerability in Microsoft Outlook that allows NTLM credential theft.",
        "type": "cve"
    },
    {
        "id": "doc3",
        "content": "Recent intelligence indicates APT29 has started exploiting CVE-2023-23397 to deliver Cobalt Strike beacons to targeted healthcare IPs.",
        "type": "intelligence"
    }
]

def setup_qdrant():
    vector_size = model.get_sentence_embedding_dimension()
    
    # Recreate collection
    try:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )
        print(f"Collection {COLLECTION_NAME} created/recreated.")
    except Exception as e:
        print(f"Error creating collection: {e}")

def ingest_data():
    points = []
    
    for i, doc in enumerate(cyber_docs):
        # Generate embedding
        vector = model.encode(doc["content"]).tolist()
        
        # Create Qdrant Point
        point = PointStruct(
            id=i+1,
            vector=vector,
            payload={
                "content": doc["content"],
                "doc_id": doc["id"],
                "type": doc["type"]
            }
        )
        points.append(point)
        print(f"Processed document {doc['id']}")
        
    try:
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Successfully ingested {len(points)} documents into Qdrant.")
    except Exception as e:
        print(f"Error upserting to Qdrant: {e}")

if __name__ == "__main__":
    print("Starting Ingestion Pipeline...")
    setup_qdrant()
    ingest_data()
    print("Pipeline Complete.")
