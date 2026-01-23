# Runbook

## Run locally

```bash
docker compose up --build
docker compose exec api alembic upgrade head
```

Backend is available at `http://localhost:8000`.

## Common issues

- `ModuleNotFoundError: No module named 'app'` when running Alembic
  - Use `docker compose exec -e PYTHONPATH=/app api alembic upgrade head`

- `psycopg2` connection errors
  - Ensure Postgres is healthy and `DATABASE_URL` points to the Docker service: `postgres`.

- `401 Unauthorized` on inventory/orders
  - Log in first and send `Authorization: Bearer <token>`.
