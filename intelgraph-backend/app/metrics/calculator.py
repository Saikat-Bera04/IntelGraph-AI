import tiktoken
import time

# Pricing per 1M tokens (Gemini 2.5 Flash approximate)
INPUT_COST_PER_1M = 0.075
OUTPUT_COST_PER_1M = 0.30

class MetricsCalculator:
    def __init__(self):
        # We use cl100k_base as a fallback approximation if specific model tokenizer isn't available
        try:
            self.encoding = tiktoken.get_encoding("cl100k_base")
        except Exception:
            self.encoding = None

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        if self.encoding:
            return len(self.encoding.encode(text))
        return len(text.split()) * 1.3 # Rough fallback

    def calculate_cost(self, prompt_tokens: int, completion_tokens: int) -> float:
        input_cost = (prompt_tokens / 1_000_000) * INPUT_COST_PER_1M
        output_cost = (completion_tokens / 1_000_000) * OUTPUT_COST_PER_1M
        return input_cost + output_cost

metrics_calculator = MetricsCalculator()
