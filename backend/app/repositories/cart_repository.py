from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.app.models.product import CartItem, Product


def get_cart(db: Session, user_id: int) -> list[CartItem]:
    return (
        db.execute(
            select(CartItem)
            .options(selectinload(CartItem.product).selectinload(Product.images))
            .where(CartItem.user_id == user_id)
        )
        .scalars()
        .all()
    )


def get_cart_item(db: Session, user_id: int, product_id: int, size: str) -> Optional[CartItem]:
    return db.execute(
        select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
            CartItem.size == size,
        )
    ).scalar_one_or_none()


def add_to_cart(db: Session, user_id: int, product_id: int, size: str, quantity: int = 1) -> CartItem:
    item = get_cart_item(db, user_id, product_id, size)
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, size=size, quantity=quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_cart_item_quantity(db: Session, user_id: int, item_id: int, quantity: int) -> Optional[CartItem]:
    item = db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    ).scalar_one_or_none()
    if not item:
        return None
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item


def remove_cart_item(db: Session, user_id: int, item_id: int) -> bool:
    item = db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    ).scalar_one_or_none()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


def clear_cart(db: Session, user_id: int) -> None:
    items = db.execute(select(CartItem).where(CartItem.user_id == user_id)).scalars().all()
    for item in items:
        db.delete(item)
    db.commit()
