from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.app.models.order import Order, OrderItem


def create_order(db: Session, user_id: int, total_amount: float, delivery_address: Optional[str]) -> Order:
    order = Order(user_id=user_id, total_amount=total_amount, delivery_address=delivery_address)
    db.add(order)
    db.flush()
    return order


def add_order_item(
    db: Session,
    order_id: int,
    product_id: int,
    size: str,
    quantity: int,
    price_at_order: float,
) -> OrderItem:
    item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        size=size,
        quantity=quantity,
        price_at_order=price_at_order,
    )
    db.add(item)
    return item


def get_user_orders(db: Session, user_id: int) -> list[Order]:
    return (
        db.execute(
            select(Order)
            .options(
                selectinload(Order.items).selectinload(OrderItem.product).selectinload(
                    lambda p: p.images
                )
            )
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        .scalars()
        .all()
    )


def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.execute(
        select(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(
                lambda p: p.images
            )
        )
        .where(Order.id == order_id)
    ).scalar_one_or_none()


def list_all_orders(db: Session, skip: int = 0, limit: int = 50) -> list[Order]:
    return (
        db.execute(
            select(Order)
            .options(selectinload(Order.items), selectinload(Order.user))
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        .scalars()
        .all()
    )


def update_order_status(db: Session, order_id: int, status: str) -> Optional[Order]:
    order = db.get(Order, order_id)
    if not order:
        return None
    order.status = status
    db.commit()
    db.refresh(order)
    return order
