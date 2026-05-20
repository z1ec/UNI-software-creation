from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.models.order import Order, OrderItem
from backend.app.repositories.cart_repository import clear_cart, get_cart
from backend.app.repositories.order_repository import (
    add_order_item,
    create_order,
    get_order_by_id,
    get_user_orders,
    list_all_orders,
    update_order_status,
)
from backend.app.schemas.order import AdminOrderSchema, OrderItemSchema, OrderSchema

VALID_STATUSES = {"pending", "confirmed", "shipped", "delivered", "cancelled"}


def _order_item_to_schema(item: OrderItem) -> OrderItemSchema:
    product = item.product
    image = next((img.url for img in product.images if img.is_primary), None)
    if not image and product.images:
        image = product.images[0].url
    return OrderItemSchema(
        id=item.id,
        product_id=product.id,
        title=product.title,
        brand=product.brand,
        image=image,
        size=item.size,
        quantity=item.quantity,
        price_at_order=item.price_at_order,
        subtotal=round(item.price_at_order * item.quantity, 2),
    )


def _order_to_schema(order: Order) -> OrderSchema:
    return OrderSchema(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        delivery_address=order.delivery_address,
        created_at=order.created_at,
        items=[_order_item_to_schema(item) for item in order.items],
    )


def checkout(db: Session, user_id: int, delivery_address: str | None) -> OrderSchema:
    cart_items = get_cart(db, user_id)
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    total = 0.0
    order = create_order(db, user_id=user_id, total_amount=0, delivery_address=delivery_address)

    for item in cart_items:
        product = item.product
        price = product.price
        if product.discount:
            price = round(price * (1 - product.discount / 100), 2)
        subtotal = price * item.quantity
        total += subtotal
        add_order_item(
            db,
            order_id=order.id,
            product_id=product.id,
            size=item.size,
            quantity=item.quantity,
            price_at_order=price,
        )

    order.total_amount = round(total, 2)
    clear_cart(db, user_id)
    db.commit()
    db.refresh(order)
    return _order_to_schema(order)


def get_my_orders(db: Session, user_id: int) -> list[OrderSchema]:
    orders = get_user_orders(db, user_id)
    return [_order_to_schema(o) for o in orders]


def get_order_detail(db: Session, user_id: int, order_id: int) -> OrderSchema:
    order = get_order_by_id(db, order_id)
    if not order or order.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _order_to_schema(order)


def admin_list_orders(db: Session, skip: int = 0, limit: int = 50) -> list[AdminOrderSchema]:
    orders = list_all_orders(db, skip, limit)
    return [
        AdminOrderSchema(
            id=o.id,
            user_id=o.user_id,
            user_email=o.user.email,
            status=o.status,
            total_amount=o.total_amount,
            created_at=o.created_at,
            items_count=len(o.items),
        )
        for o in orders
    ]


def admin_update_status(db: Session, order_id: int, new_status: str) -> OrderSchema:
    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed: {', '.join(VALID_STATUSES)}",
        )
    order = update_order_status(db, order_id, new_status)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order_full = get_order_by_id(db, order_id)
    return _order_to_schema(order_full)
