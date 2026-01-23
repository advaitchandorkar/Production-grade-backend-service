# opsflow-backend

![CI](https://img.shields.io/badge/CI-pending-lightgrey)

Live Demo: https://your-vercel-app.vercel.app

API Docs: https://your-api-domain.example.com/docs

Production-style FastAPI backend with Postgres, SQLAlchemy 2.0, Alembic, and JWT auth.

## Architecture

```
+-------------+        HTTPS        +--------------------+        SQL        +-----------+
|  Frontend   |  <----------------> |  FastAPI API (JWT) |  <------------->  | Postgres |
|   Vercel    |                     |   Docker runtime   |                   |  (RDS)   |
+-------------+                     +--------------------+                   +-----------+
```

## Local setup

```bash
docker compose up --build
docker compose exec api alembic upgrade head
```

Health check: `http://localhost:8000/health`

## Curl examples

Register:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@example.com", "password": "supersecret"}'
```

Login (export token):

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@example.com", "password": "supersecret"}' | jq -r '.access_token')
```

Inventory list:

```bash
curl -H "Authorization: Bearer ${TOKEN}" http://localhost:8000/inventory
```

Add inventory item:

```bash
curl -X POST http://localhost:8000/inventory \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"name": "Widget", "quantity": 10}'
```

Orders list:

```bash
curl -H "Authorization: Bearer ${TOKEN}" http://localhost:8000/orders
```

Create order:

```bash
curl -X POST http://localhost:8000/orders \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"item_name": "Widget", "quantity": 2}'
```

## Frontend (Vite)

The React frontend lives in `../opsflow-frontend` and expects `VITE_API_BASE_URL`.

## Backend deployment

### Render (Docker Web Service)

- Service type: Docker Web Service
- Root directory: `opsflow-backend`
- Dockerfile: `opsflow-backend/Dockerfile`
- Environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET_KEY`
  - `JWT_ALGORITHM` (default: `HS256`)
  - `ACCESS_TOKEN_EXPIRE_MINUTES` (default: `60`)
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Health check: `/health`
- API docs: `https://<render-service>.onrender.com/docs`

### Fly.io

- From `opsflow-backend`: `fly launch`
- Set env vars:
  - `fly secrets set DATABASE_URL=... JWT_SECRET_KEY=... JWT_ALGORITHM=HS256 ACCESS_TOKEN_EXPIRE_MINUTES=60`
- Deploy: `fly deploy`
- Health check: `/health`

## Load testing (k6)

```bash
k6 run -e BASE_URL=http://localhost:8000 scripts/k6-smoke.js
```

## Docs

- `docs/architecture.md`
- `docs/api.md`
- `docs/runbook.md`
