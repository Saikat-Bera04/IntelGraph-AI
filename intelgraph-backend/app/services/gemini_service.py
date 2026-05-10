import google.generativeai as genai
import os
from dotenv import load_dotenv
from app.metrics.calculator import metrics_calculator
import time

load_dotenv()

# We need to handle case where API key isn't set yet during development
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_key":
    genai.configure(api_key=api_key)

class GeminiService:
    def __init__(self):
        # We will use gemini-1.5-flash as it's generally available, or 2.5 if it exists in the SDK
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def generate_response(self, prompt: str, context: str = "") -> dict:
        full_prompt = f"Context:\n{context}\n\nQuery:\n{prompt}" if context else prompt
        
        start_time = time.time()
        
        # In a real environment with API key:
        if api_key and api_key != "your_key":
            try:
                response = self.model.generate_content(full_prompt)
                answer = response.text
            except Exception as e:
                answer = f"Error generating response: {str(e)}"
        else:
            # Mock response for hackathon/development without key
            time.sleep(1.2) # Simulate latency
            answer = "This is a simulated response since GEMINI_API_KEY is not configured."

        end_time = time.time()
        latency = end_time - start_time
        
        prompt_tokens = metrics_calculator.count_tokens(full_prompt)
        completion_tokens = metrics_calculator.count_tokens(answer)
        total_tokens = prompt_tokens + completion_tokens
        
        cost = metrics_calculator.calculate_cost(prompt_tokens, completion_tokens)
        
        return {
            "answer": answer,
            "metrics": {
                "tokens_used": total_tokens,
                "latency_seconds": latency,
                "cost_usd": cost,
                # Accuracy will be calculated elsewhere or mocked
                "accuracy_score": 0.0
            }
        }

gemini_service = GeminiService()
