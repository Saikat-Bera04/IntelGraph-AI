import logging
import os
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.query import router as query_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Validate required environment variables at startup
def validate_environment():
    """Check required env vars are set at application startup."""
    required_vars = ["GEMINI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var, "").strip()
        if not value or value == "your_key":
            missing_vars.append(var)
    
    if missing_vars:
        logger.warning(f"⚠️  Missing or invalid environment variables: {', '.join(missing_vars)}")
        logger.warning("The application will start but API calls may fail. Set these in .env:")
        for var in missing_vars:
            logger.warning(f"  {var}=<your_value>")
    else:
        logger.info("✅ All required environment variables are configured.")

app = FastAPI(
    title="IntelGraph AI Backend",
    description="GraphRAG-powered cybersecurity investigation platform",
    version="1.0.0"
)

# Add startup event to validate environment
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting IntelGraph AI Backend...")
    validate_environment()
    logger.info("Backend initialized successfully.")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    # Provide more context in error response
    error_type = type(exc).__name__
    error_msg = str(exc)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "An internal server error occurred.",
            "error_type": error_type,
            "details": error_msg,
            "hint": "Check backend logs for stack trace. Verify all environment variables are set correctly."
        },
    )

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "IntelGraph Backend Running"}
