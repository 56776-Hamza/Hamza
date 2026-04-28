import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ai, documents


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="AI Productivity App",
    description="AI-powered productivity suite for reports, code, documents, emails, and more",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "api_key_configured": bool(os.environ.get("OPENAI_API_KEY")),
    }
