from typing import List, Optional

from pydantic import BaseModel


class AddToCartRequest(BaseModel):
    product_id: int
    size: str
    quantity: int = 1


class UpdateCartItemRequest(BaseModel):
    quantity: int


class CartItemSchema(BaseModel):
    id: int
    product_id: int
    title: str
    brand: str
    image: Optional[str] = None
    price: float
    discount: Optional[int] = None
    final_price: float
    size: str
    quantity: int
    subtotal: float

    model_config = {"from_attributes": True}


class CartSchema(BaseModel):
    items: List[CartItemSchema]
    total: float
    items_count: int
