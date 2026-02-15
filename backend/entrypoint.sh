#!/bin/sh
set -e

alembic -c backend/alembic.ini upgrade head

exec "$@"
