from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=5000)
    
    @validator('query')
    def validate_query(cls, v):
        """Validate query string."""
        if not v or not v.strip():
            raise ValueError("Query cannot be empty or whitespace-only")
        if len(v.strip()) > 5000:
            raise ValueError("Query exceeds maximum length of 5000 characters")
        return v.strip()

class PipelineMetrics(BaseModel):
    tokens_used: int
    latency_seconds: float
    cost_usd: float
    accuracy_score: float

class PipelineResponse(BaseModel):
    answer: str
    metrics: PipelineMetrics
    evidence: Optional[List[Dict[str, Any]]] = None

class BenchmarkResponse(BaseModel):
    llm_only: PipelineResponse
    basic_rag: PipelineResponse
    graphrag: PipelineResponse

class EvaluationRequest(BaseModel):
    query: str
    reference_answer: str
    candidate_answer: str

class EvaluationResponse(BaseModel):
    bert_score: Dict[str, float]
    llm_judge: Dict[str, Any]
