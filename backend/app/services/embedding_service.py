import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

def get_embeddings(texts: List[str]) -> List[Optional[List[float]]]:
    """
    Semantic Embeddings are currently disabled to remove OpenAI dependency.
    System will gracefully fall back to keyword-based search.
    Returns a list of None.
    """
    logger.info("Semantic Embeddings are disabled. Falling back to keyword search.")
    return [None for _ in texts]


def get_embedding(text: str) -> Optional[List[float]]:
    """
    Generate a 1536-dimensional embedding for a single string.
    Returns None since embeddings are disabled.
    """
    return get_embeddings([text])[0]
