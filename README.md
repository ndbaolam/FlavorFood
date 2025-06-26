# Run with Docker
```sh
docker compose up -d --build
```

# Run manually
```sh
cd fastapi
source venv/bin/activate
uvicorn main:app --port 8000 --reload

cd ../backend
docker compose up -d
yarn dev

cd ../frontend
yarn dev
```