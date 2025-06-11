from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import numpy as np

app = FastAPI()
model = SentenceTransformer('dangvantuan/vietnamese-document-embedding', trust_remote_code=True)

def average_and_normalize(vectors):
    avg_vector = np.mean(vectors, axis=0)
    norm = np.linalg.norm(avg_vector)
    if norm == 0:
        return avg_vector
    return avg_vector / norm

@app.post("/embed")
async def embed(request: Request):
    body = await request.json()

    embeddings = []
    for value in body.values():
        embeddings.append(model.encode(str(value)))
    
    normalized_vector = average_and_normalize(embeddings)

    return {"embedding": normalized_vector.tolist()}
