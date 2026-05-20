from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.models.product import CartItem
from backend.app.repositories.cart_repository import (
    add_to_cart,
    clear_cart,
    get_cart,
    remove_cart_item,
    update_cart_item_quantity,
)
from backend.app.repositories.product_repository import get_product_by_id
from backend.app.schemas.cart import CartItemSchema, CartSchema


def _cart_item_to_schema(item: CartItem) -> CartItemSchema:
    product = item.product
    price = product.price
    discount = product.discount
    final_price = round(price * (1 - discount / 100), 2) if discount else price
    image = next((img.url for img in product.images if img.is_primary), None)
    if not image and product.images:
        image = product.images[0].url

    return CartItemSchema(
        id=item.id,
        product_id=product.id,
        title=product.title,
        brand=product.brand,
        image=image,
        price=price,
        discount=discount,
        final_price=final_price,
        size=item.size,
        quantity=item.quantity,
        subtotal=round(final_price * item.quantity, 2),
    )


def get_user_cart(db: Session, user_id: int) -> CartSchema:
    items = get_cart(db, user_id)
    schemas = [_cart_item_to_schema(item) for item in items]
    total = sum(s.subtotal for s in schemas)
    return CartSchema(items=schemas, total=round(total, 2), items_count=len(schemas))


def add_item_to_cart(db: Session, user_id: int, product_id: int, size: str, quantity: int) -> CartSchema:
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    size_obj = next((s for s in product.sizes if s.size == size), None)
    if not size_obj:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Size '{size}' not available")
    if size_obj.stock < quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")

    add_to_cart(db, user_id, product_id, size, quantity)
    return get_user_cart(db, user_id)


def update_item_quantity(db: Session, user_id: int, item_id: int, quantity: int) -> CartSchema:
    if quantity <= 0:
        remove_cart_item(db, user_id, item_id)
    else:
        item = update_cart_item_quantity(db, user_id, item_id, quantity)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    return get_user_cart(db, user_id)


def remove_item_from_cart(db: Session, user_id: int, item_id: int) -> CartSchema:
    if not remove_cart_item(db, user_id, item_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    return get_user_cart(db, user_id)


def clear_user_cart(db: Session, user_id: int) -> CartSchema:
    clear_cart(db, user_id)
    return get_user_cart(db, user_id)
