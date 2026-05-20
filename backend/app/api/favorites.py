from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.repositories.favorite_repository import (
    add_favorite,
    get_favorites,
    remove_favorite,
)
from backend.app.repositories.product_repository import get_product_by_id
from backend.app.schemas.product import ProductListItemSchema
from backend.app.services.product_service import build_product_list_item

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=list[ProductListItemSchema])
def get_my_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(connect_db)):
    favs = get_favorites(db, current_user.id)
    return [build_product_list_item(fav.product) for fav in favs]


@router.post("/{product_id}", status_code=status.HTTP_201_CREATED)
def add_to_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    if not get_product_by_id(db, product_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    try:
        add_favorite(db, current_user.id, product_id)
    except Exception:
        pass  # already in favorites
    return {"detail": "Added to favorites"}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def remove_from_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    remove_favorite(db, current_user.id, product_id)
    return {"detail": "Removed from favorites"}
