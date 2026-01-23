# Architecture

## System overview

OpsFlow is a small service split into a FastAPI backend and a React frontend. The backend exposes REST endpoints for authentication, inventory, and orders. Postgres stores state, and Alembic manages schema changes.

```
+-------------+        HTTPS        +--------------------+        SQL        +-----------+
|  Frontend   |  <----------------> |  FastAPI API (JWT) |  <------------->  | Postgres |
|   Vercel    |                     |   Docker runtime   |                   |  (RDS)   |
+-------------+                     +--------------------+                   +-----------+
```

## Key tradeoffs

- Stateless API: JWT auth keeps the API stateless, but requires token rotation and client-side handling.
- Simple inventory model: inventory and orders are independent tables; relationships are deferred until needed.
- Docker-first deployments: easier parity between local and hosted environments, at the cost of larger images.
- Minimal auth scope: only guards inventory/orders routes; no refresh tokens or role-based policies yet.
