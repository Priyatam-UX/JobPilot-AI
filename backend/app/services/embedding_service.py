import logging
from typing import List
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate 1536-dimensional embeddings for a list of strings using text-embedding-3-small.
    Returns a list of vectors.
    """
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "mock-key":
        logger.warning("OPENAI_API_KEY not configured. Falling back to mock embeddings (zero vector).")
        return [[0.0] * 1536 for _ in texts]
        
    try:
        embeddings_model = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=settings.OPENAI_API_KEY
        )
        return embeddings_model.embed_documents(texts)
    except Exception as e:
        logger.error(f"Failed to generate embeddings: {e}")
        return [[0.0] * 1536 for _ in texts]


def get_embedding(text: str) -> List[float]:
    """
    Generate a 1536-dimensional embedding for a single string.
    """
    return get_embeddings([text])[0]
