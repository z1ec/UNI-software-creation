import psycopg
from config import settings


print(f"Connecting to: {settings.get_db_url()}")

try:
    conn = psycopg.connect(
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
    )
    print("[OK] Direct connection via psycopg")
    conn.close()
except Exception as e:
    print(f"[ERROR] Direct connection failed: {ascii(e)}")

try:
    from sqlalchemy import create_engine, text

    engine = create_engine(settings.get_db_url())
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("[OK] SQLAlchemy connection")
except Exception as e:
    print(f"[ERROR] SQLAlchemy failed: {ascii(e)}")
