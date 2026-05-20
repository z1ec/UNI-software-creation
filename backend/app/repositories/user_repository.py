from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.user import RefreshToken, User


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.execute(select(User).where(User.email == email.lower())).scalar_one_or_none()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.get(User, user_id)


def create_user(db: Session, email: str, full_name: str, password_hash: str) -> User:
    user = User(email=email.lower(), full_name=full_name, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def save_refresh_token(db: Session, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
    rt = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(rt)
    db.commit()
    return rt


def get_refresh_token(db: Session, token: str) -> Optional[RefreshToken]:
    return db.execute(select(RefreshToken).where(RefreshToken.token == token)).scalar_one_or_none()


def delete_refresh_token(db: Session, token: str) -> None:
    rt = db.execute(select(RefreshToken).where(RefreshToken.token == token)).scalar_one_or_none()
    if rt:
        db.delete(rt)
        db.commit()


def delete_user_refresh_tokens(db: Session, user_id: int) -> None:
    tokens = db.execute(select(RefreshToken).where(RefreshToken.user_id == user_id)).scalars().all()
    for t in tokens:
        db.delete(t)
    db.commit()


def list_users(db: Session, skip: int = 0, limit: int = 50) -> list[User]:
    return db.execute(select(User).offset(skip).limit(limit)).scalars().all()


def update_user_role(db: Session, user_id: int, role: str) -> Optional[User]:
    user = db.get(User, user_id)
    if not user:
        return None
    user.role = role
    db.commit()
    db.refresh(user)
    return user
