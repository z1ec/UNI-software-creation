from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.cart import AddToCartRequest, CartSchema, UpdateCartItemRequest
from backend.app.services.cart_service import (
    add_item_to_cart,
    clear_user_cart,
    get_user_cart,
    remove_item_from_cart,
    update_item_quantity,
)

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("", response_model=CartSchema)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(connect_db)):
    return get_user_cart(db, current_user.id)


@router.post("", response_model=CartSchema)
def add_to_cart(
    body: AddToCartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    return add_item_to_cart(db, current_user.id, body.product_id, body.size, body.quantity)


@router.patch("/{item_id}", response_model=CartSchema)
def update_cart_item(
    item_id: int,
    body: UpdateCartItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    return update_item_quantity(db, current_user.id, item_id, body.quantity)


@router.delete("/{item_id}", response_model=CartSchema)
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    return remove_item_from_cart(db, current_user.id, item_id)


@router.delete("", response_model=CartSchema)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(connect_db)):
    return clear_user_cart(db, current_user.id)
