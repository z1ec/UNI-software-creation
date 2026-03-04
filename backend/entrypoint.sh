#!/bin/sh
set -e

alembic -c /app/backend/alembic.ini upgrade head

exec "$@"
