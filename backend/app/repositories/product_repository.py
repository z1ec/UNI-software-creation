from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from backend.app.models.product import Product, ProductVariant, Review


def list_products_with_preview(db: Session) -> list[Product]:
    return db.execute(
        select(Product).options(
            selectinload(Product.product_variants),
            selectinload(Product.discounts),
            selectinload(Product.product_content),
        )
    ).scalars().all()


def get_product_with_details(product_id: int, db: Session) -> Optional[Product]:
    return db.execute(
        select(Product)
        .options(
            selectinload(Product.reviews),
            selectinload(Product.product_variants),
            selectinload(Product.discounts),
            selectinload(Product.product_content),
        )
        .where(Product.id == product_id)
    ).scalar_one_or_none()


def get_product_rating_aggregate(product_id: int, db: Session) -> tuple[int, Optional[float]]:
    result = db.execute(
        select(
            func.count(Review.id).label("rating_count"),
            func.avg(Review.estimate).label("rating_avg"),
        ).where(Review.product_id == product_id)
    ).one()

    return int(result.rating_count or 0), (
        round(float(result.rating_avg), 2) if result.rating_avg is not None else None
    )


def get_product_stock_sum(product_id: int, db: Session) -> int:
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
