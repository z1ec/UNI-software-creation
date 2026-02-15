from fastapi import FastAPI, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db import SessionLocal, get_db
from backend.app.models import Message

app = FastAPI()


@app.on_event("startup")
def seed_message():
    db = SessionLocal()
    try:
        existing = db.execute(select(Message).limit(1)).scalar_one_or_none()
        if existing is None:
            db.add(Message(text="Hello World"))
            db.commit()
    finally:
        db.close()


@app.get("/api/hello")
def read_hello(db: Session = Depends(get_db)):
    message = db.execute(select(Message).order_by(Message.id.asc()).limit(1)).scalar_one()
    return {"message": message.text}
