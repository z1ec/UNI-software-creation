from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import require_admin
from backend.app.models.user import User
from backend.app.repositories.product_repository import create_category, list_categories
from backend.app.schemas.product import CategoryCreateRequest, CategorySchema

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[CategorySchema])
def get_categories(db: Session = Depends(connect_db)):
    return list_categories(db)


@router.post("", response_model=CategorySchema, status_code=status.HTTP_201_CREATED)
def create_category_endpoint(
    body: CategoryCreateRequest,
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    try:
        return create_category(db, name=body.name, slug=body.slug)
    except Exception:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category slug already exists")
