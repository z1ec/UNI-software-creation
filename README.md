# UNI Software Creation

Полноценное веб-приложение интернет-магазина с разделением на:
- `frontend` (React + Vite)
- `backend` (FastAPI + SQLAlchemy)
- `db` (PostgreSQL)

Проект запускается через `docker compose` и ориентирован на дальнейшее расширение каталога товаров, карточек и API.

## Стек технологий

### Frontend
- React 19
- TypeScript
- Vite
- ESLint
- Nginx (раздача production-сборки)

### Backend
- FastAPI
- Uvicorn
- SQLAlchemy 2.0
- Alembic (миграции)
- Pydantic / pydantic-settings
- Psycopg 3

### Data & Infra
- PostgreSQL 16 (контейнер)
- Docker, Docker Compose

## Архитектура

```text
Browser
  -> Frontend (Nginx, :8080)
    -> /api/* proxy
      -> Backend (FastAPI, :8000)
        -> PostgreSQL (:5432)
```

Сервисы из `docker-compose.yml`:
- `frontend` — сборка React-приложения и раздача статики через Nginx.
- `backend` — API и бизнес-логика.
- `db` — база данных PostgreSQL с volume `postgres_data`.

## Структура проекта

```text
.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── models.py
│   ├── alembic/
│   ├── main.py
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── init-db.sql
└── requirements.txt
```

## Быстрый старт (Docker Compose)

Запуск всех сервисов:

```bash
docker compose up -d --build
```

Проверка статуса:

```bash
docker compose ps
```

Логи:

```bash
docker compose logs -f
```

Остановка:

```bash
docker compose down
```

Остановка с удалением volume БД:

```bash
docker compose down -v
```

## Локальный запуск без Docker

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API (текущие endpoint'ы)

- `GET /products` — список всех товаров.
- `GET /products/{productID}` — товар по ID.

## Миграции БД

В Docker-режиме миграции применяются автоматически в `backend/entrypoint.sh`:

```bash
alembic -c /app/backend/alembic.ini upgrade head
```

Локально:

```bash
alembic -c backend/alembic.ini upgrade head
```


## Полезные команды

Переcборка только frontend:

```bash
docker compose up -d --build frontend
```

Переcборка только backend:

```bash
docker compose up -d --build backend
```

Проверка backend API:

```bash
curl http://localhost:8000/products
```
