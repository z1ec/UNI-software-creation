from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CreateOrderRequest(BaseModel):
    delivery_address: Optional[str] = None


class OrderItemSchema(BaseModel):
    id: int
    product_id: int
    title: str
    brand: str
    image: Optional[str] = None
    size: str
    quantity: int
    price_at_order: float
    subtotal: float

    model_config = {"from_attributes": True}


class OrderSchema(BaseModel):
    id: int
    status: str
    total_amount: float
    delivery_address: Optional[str] = None
    created_at: datetime
    items: List[OrderItemSchema]

    model_config = {"from_attributes": True}


class UpdateOrderStatusRequest(BaseModel):
    status: str


class AdminOrderSchema(BaseModel):
    id: int
    user_id: int
    user_email: str
    status: str
    total_amount: float
    created_at: datetime
    items_count: int

    model_config = {"from_attributes": True}
