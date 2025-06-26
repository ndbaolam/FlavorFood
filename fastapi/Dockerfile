FROM python:3.10-slim

ENV TRANSFORMERS_CACHE=/app/.cache/huggingface \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

RUN python -c "\
from sentence_transformers import SentenceTransformer; \
SentenceTransformer('dangvantuan/vietnamese-document-embedding', trust_remote_code=True)"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
