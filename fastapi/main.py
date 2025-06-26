from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
model = SentenceTransformer('dangvantuan/vietnamese-document-embedding', trust_remote_code=True)

def average_and_normalize(vectors):
    avg_vector = np.mean(vectors, axis=0)
    norm = np.linalg.norm(avg_vector)
    return avg_vector if norm == 0 else avg_vector / norm

@app.post("/embed")
async def embed(request: Request):
    body = await request.json()
    texts = list(map(str, body.values()))
    embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=False)
    normalized_vector = average_and_normalize(embeddings)
    return {"embedding": normalized_vector.tolist()}