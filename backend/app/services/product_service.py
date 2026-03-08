from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models import Product, ProductVariant, Review
from backend.app.schemas import ProductRatingSchema

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
    result = db.execute(
        select(
            func.count(Review.id).label("rating_count"),
            func.avg(Review.estimate).label("rating_avg"),
        ).where(Review.product_id == product_id)
    ).one()

    rating_count = int(result.rating_count or 0)
    rating_avg = round(float(result.rating_avg), 2) if result.rating_avg is not None else None
    return ProductRatingSchema(rating_avg=rating_avg, rating_count=rating_count)

# вычисляет остаток товаров по сумме остатка размеров
def get_product_stock(product_id: int, db: Session) -> int:
    stock_value = db.execute(
        select(
            func.coalesce(
                func.sum(
                    ProductVariant.S
                    + ProductVariant.M
                    + ProductVariant.L
                    + ProductVariant.XL
                    + ProductVariant.XXL
                ),
                0,
            )
        ).where(ProductVariant.product_id == product_id)
    ).scalar_one()
    return int(stock_value)
