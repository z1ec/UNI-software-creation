from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ProductListItemSchema(BaseModel):
    id: int
    title: str
    image: Optional[str] = None
    price: float
    discount: Optional[int] = None
    stock: int
    new: bool
    brand: str
    type: str


class ReviewPublicSchema(BaseModel):
    review: str
    estimate: int


class ProductVariantPublicSchema(BaseModel):
    price: float
    stock: int
    s: int
    m: int
    l: int
    xl: int
    xxl: int
    new: bool
    brand: str
    type: str


class DiscountPublicSchema(BaseModel):
    discount: int
    t_start: datetime
    t_end: datetime
    active: bool


class ProductContentPublicSchema(BaseModel):
    image: Optional[str] = None
    video: Optional[str] = None


class ProductRatingSchema(BaseModel):
    rating_avg: Optional[float] = None
    rating_count: int


class ProductDetailSchema(BaseModel):
    id: int
    product_id: int
    title: str
    description: Optional[str] = None
    gender: str
    ratings: ProductRatingSchema
    reviews: List[ReviewPublicSchema]
    product_variants: List[ProductVariantPublicSchema]
    discounts: List[DiscountPublicSchema]
    product_content: List[ProductContentPublicSchema]
