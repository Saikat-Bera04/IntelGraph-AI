import logging
import os
from pydantic import BaseModel
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class LLMJudgeResult(BaseModel):
    status: str # PASS or FAIL
    reasoning: str
    confidence: float

class EvaluationService:
    def __init__(self):
        self.bert_score = None
        try:
            from bert_score import BERTScorer
            # Use a smaller model for hackathon speed
            self.bert_score = BERTScorer(lang="en", model_type="distilbert-base-uncased")
            logger.info("BERTScore loaded successfully.")
        except ImportError:
            logger.warning("bert-score not installed. BERTScore evaluation will be skipped.")
        except Exception as e:
            logger.error(f"Error loading BERTScore: {e}")

    def evaluate_bertscore(self, reference: str, candidate: str) -> dict:
        """
        Calculates the BERTScore comparing the generated answer to a reference.
        Returns precision, recall, and f1 score.
        """
        if not self.bert_score:
            return {"precision": 0.0, "recall": 0.0, "f1": 0.0, "error": "bert-score not available"}
        
        try:
            P, R, F1 = self.bert_score.score([candidate], [reference])
            return {
                "precision": P.item(),
                "recall": R.item(),
                "f1": F1.item()
            }
        except Exception as e:
            logger.error(f"BERTScore evaluation failed: {e}")
            return {"precision": 0.0, "recall": 0.0, "f1": 0.0, "error": str(e)}

    async def evaluate_llm_as_judge(self, query: str, reference: str, candidate: str) -> dict:
        """
        Uses Gemini to judge if the candidate answer meets the quality of the reference answer.
        """
        prompt = f"""
        You are an expert cybersecurity evaluator.
        Compare the generated answer with the reference answer for the given query.

        Query: {query}
        Reference Answer: {reference}
        Generated Answer: {candidate}

        Return your evaluation exactly in this format:
        STATUS: PASS or FAIL
        REASONING: short explanation
        CONFIDENCE: number between 0.0 and 1.0
        """
        try:
            response = await gemini_service.generate_response(prompt)
            answer = response["answer"]
            
            # Simple parsing of the expected output format
            status = "FAIL"
            reasoning = "Parsing failed"
            confidence = 0.0
            
            for line in answer.split('\n'):
                if line.startswith("STATUS:"):
                    status = line.replace("STATUS:", "").strip()
                elif line.startswith("REASONING:"):
                    reasoning = line.replace("REASONING:", "").strip()
                elif line.startswith("CONFIDENCE:"):
                    try:
                        confidence = float(line.replace("CONFIDENCE:", "").strip())
                    except ValueError:
                        pass
                        
            return {
                "status": status,
                "reasoning": reasoning,
                "confidence": confidence
            }
        except Exception as e:
            logger.error(f"LLM-as-a-judge failed: {e}")
            return {"status": "ERROR", "reasoning": str(e), "confidence": 0.0}

evaluation_service = EvaluationService()
