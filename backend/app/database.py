from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from .config import settings

DB_URL = settings.get_db_url()

# движок для подключения к бд
engine = create_engine(url=DB_URL, pool_pre_ping=True)

#создатель сессии 
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)

# базовый родитель для всех остальных таблиц (заткнутый батя ушедший за хлебом)
class Base(DeclarativeBase):
    pass


# установка сессии для FastAPI
def connect_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
