# API Summary

Base URL: `http://localhost:8000`

## Health

- `GET /health` -> `{ "status": "ok" }`

## Auth

- `POST /auth/register`
  - Body: `{ "email": "user@example.com", "password": "supersecret" }`
  - Response: user record

- `POST /auth/login`
  - Body: `{ "email": "user@example.com", "password": "supersecret" }`
  - Response: `{ "access_token": "...", "token_type": "bearer" }`

## Inventory (JWT required)

- `GET /inventory` -> list items
- `POST /inventory`
  - Body: `{ "name": "Widget", "quantity": 10 }`

## Orders (JWT required)

- `GET /orders` -> list orders
- `POST /orders`
  - Body: `{ "item_name": "Widget", "quantity": 2 }`
