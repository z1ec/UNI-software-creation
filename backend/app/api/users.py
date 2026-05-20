from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.user import UpdateProfileRequest, UserProfileSchema

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserProfileSchema)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserProfileSchema)
def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    current_user.full_name = body.full_name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user
