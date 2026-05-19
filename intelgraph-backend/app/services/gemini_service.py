import os
import time
from dotenv import load_dotenv
from app.metrics.calculator import metrics_calculator
import logging
try:
    import google.generativeai as genai
except Exception:
    genai = None

load_dotenv()
logger = logging.getLogger(__name__)

# Use environment-provided API key when available
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if genai and API_KEY and API_KEY != "your_key":
    try:
        genai.configure(api_key=API_KEY)
    except Exception as exc:
        logger.warning(f"Failed to configure google.generativeai: {exc}")


class GeminiService:
    def __init__(self):
        self.model_name = MODEL_NAME
        self.model = None
        # Defer creating GenerativeModel until needed so startup doesn't fail
        if genai and API_KEY and API_KEY != "your_key":
            try:
                # Lazy instantiate a model handle if possible
                self.model = genai.GenerativeModel(self.model_name)
            except Exception as exc:
                logger.warning(f"Could not initialize GenerativeModel('{self.model_name}'): {exc}")
                self.model = None

    async def generate_response(self, prompt: str, context: str = "") -> dict:
        full_prompt = f"Context:\n{context}\n\nQuery:\n{prompt}" if context else prompt
        start_time = time.time()

        answer = None

        # Try to call the Gemini API if configured and a model handle exists
        if genai and API_KEY and API_KEY != "your_key" and self.model:
            try:
                response = self.model.generate_content(full_prompt)
                # Prefer .text if available, otherwise fall back to string conversion
                if hasattr(response, "text"):
                    answer = response.text
                else:
                    answer = str(response)
            except Exception as exc:
                logger.warning(f"Gemini API error: {exc}")
                answer = None

        # If Gemini unavailable or returned error, fall back to a deterministic mock
        if not answer:
            # Simulate a lightweight delay to mimic real LLM latency
            time.sleep(0.8)
            ctx_preview = (context or "").strip().replace("\n", " ")[:300]
            q_preview = prompt.strip()[:300]
            answer = (
                "[Simulated LLM Response]\n"
                "Note: Gemini API unavailable or returned an error.\n\n"
                f"Query: {q_preview}\n\n"
                f"Context Preview: {ctx_preview}\n\n"
                "Summary: This is a simulated response used to keep the developer workflow functional."
            )

        end_time = time.time()
        latency = end_time - start_time

        prompt_tokens = metrics_calculator.count_tokens(full_prompt)
        completion_tokens = metrics_calculator.count_tokens(answer)
        total_tokens = prompt_tokens + completion_tokens

        cost = metrics_calculator.calculate_cost(prompt_tokens, completion_tokens)

        return {
            "answer": answer,
            "metrics": {
                "tokens_used": int(total_tokens),
                "latency_seconds": float(latency),
                "cost_usd": float(cost),
                "accuracy_score": 0.0,
            }
        }


gemini_service = GeminiService()
