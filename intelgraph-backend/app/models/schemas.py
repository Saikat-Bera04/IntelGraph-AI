from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class QueryRequest(BaseModel):
    query: str

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
