from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserPublic,
)
from backend.app.services.auth_service import login, logout, refresh_tokens, register

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=dict)
def register_user(body: RegisterRequest, db: Session = Depends(connect_db)):
    user, tokens = register(db, email=body.email, full_name=body.full_name, password=body.password)
    return {
        "user": UserPublic.model_validate(user),
        "tokens": tokens,
    }


@router.post("/login", response_model=dict)
def login_user(body: LoginRequest, db: Session = Depends(connect_db)):
    user, tokens = login(db, email=body.email, password=body.password)
    return {
        "user": UserPublic.model_validate(user),
        "tokens": tokens,
    }


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(connect_db)):
    return refresh_tokens(db, body.refresh_token)


@router.post("/logout")
def logout_user(
    body: RefreshRequest | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    refresh_token = body.refresh_token if body else None
    logout(db, refresh_token, current_user)
    return {"detail": "Logged out"}


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
