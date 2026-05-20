from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from backend.app.models.user import User
from backend.app.repositories.user_repository import (
    create_user,
    delete_refresh_token,
    delete_user_refresh_tokens,
    get_refresh_token,
    get_user_by_email,
    save_refresh_token,
)
from backend.app.schemas.auth import TokenResponse, UserPublic


def register(db: Session, email: str, full_name: str, password: str) -> tuple[UserPublic, TokenResponse]:
    if get_user_by_email(db, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = create_user(db, email=email, full_name=full_name, password_hash=hash_password(password))
    return user, _issue_tokens(db, user)


def login(db: Session, email: str, password: str) -> tuple[UserPublic, TokenResponse]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
    return user, _issue_tokens(db, user)


def refresh_tokens(db: Session, refresh_token: str) -> TokenResponse:
    rt = get_refresh_token(db, refresh_token)
    if not rt:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    now = datetime.now(timezone.utc)
    expires = rt.expires_at.replace(tzinfo=timezone.utc) if rt.expires_at.tzinfo is None else rt.expires_at
    if expires < now:
        delete_refresh_token(db, refresh_token)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = rt.user
    delete_refresh_token(db, refresh_token)
    return _issue_tokens(db, user)


def logout(db: Session, refresh_token: Optional[str], user: User) -> None:
    if refresh_token:
        delete_refresh_token(db, refresh_token)
    else:
        delete_user_refresh_tokens(db, user.id)


def _issue_tokens(db: Session, user: User) -> TokenResponse:
    access = create_access_token(user.id, user.role)
    refresh, expires_at = create_refresh_token(user.id)
    save_refresh_token(db, user.id, refresh, expires_at)
    return TokenResponse(access_token=access, refresh_token=refresh)
