from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from backend.app.models.product import Product
from backend.app.repositories.product_repository import (
    get_product_rating_aggregate,
    get_product_stock_sum,
)
from backend.app.schemas.product import ProductRatingSchema

MOSCOW_TZ = ZoneInfo("Europe/Moscow")


def as_moscow_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=MOSCOW_TZ)
    return value.astimezone(MOSCOW_TZ)


def active_discount_value(product: Product) -> Optional[int]:
    now_moscow = datetime.now(MOSCOW_TZ)
    active_discounts = [
        discount.discount
        for discount in product.discounts
        if as_moscow_aware(discount.t_start) <= now_moscow <= as_moscow_aware(discount.t_end)
    ]
    if not active_discounts:
        return None
    return max(active_discounts)

# вычисляет rating_count и rating_avg
def build_rating_from_db(product_id: int, db: Session) -> ProductRatingSchema:
    rating_count, rating_avg = get_product_rating_aggregate(product_id, db)
    return ProductRatingSchema(rating_avg=rating_avg, rating_count=rating_count)

# вычисляет остаток товаров по сумме остатка размеров
def get_product_stock(product_id: int, db: Session) -> int:
    return get_product_stock_sum(product_id, db)
