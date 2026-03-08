from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.app.models import Product
from backend.app.schemas import (
    DiscountPublicSchema,
    ProductContentPublicSchema,
    ProductDetailSchema,
    ProductListItemSchema,
    ProductVariantPublicSchema,
    ReviewPublicSchema,
)
from backend.app.services.product_service import (
    MOSCOW_TZ,
    active_discount_value,
    as_moscow_aware,
    build_rating_from_db,
    get_product_stock,
)

# загружает данные из бд для ендпоинта api/products
def get_products_payload(db: Session) -> List[ProductListItemSchema]:
    products = db.execute(
        select(Product).options(
            selectinload(Product.product_variants),
            selectinload(Product.discounts),
            selectinload(Product.product_content),
        )
    ).scalars().all()

    items: List[ProductListItemSchema] = []
    for product in products:
        if not product.product_variants:
            continue

        variant = product.product_variants[0]
        content = product.product_content[0] if product.product_content else None

        items.append(
            ProductListItemSchema(
                id=product.id,
                title=product.title,
                image=content.image if content else None,
                price=variant.price,
                discount=active_discount_value(product),
                stock=get_product_stock(product.id, db),
                new=variant.new,
                brand=variant.brand,
                type=variant.product_type,
            )
        )

    return items

# загружает данные из бд для ендпоинта api/products/id
def get_product_payload(product_id: int, db: Session) -> Optional[ProductDetailSchema]:
    product = db.execute(
        select(Product)
        .options(
            selectinload(Product.reviews),
            selectinload(Product.product_variants),
            selectinload(Product.discounts),
            selectinload(Product.product_content),
        )
        .where(Product.id == product_id)
    ).scalar_one_or_none()

    if product is None:
        return None

    now_moscow = datetime.now(MOSCOW_TZ)
    discounts = [
        DiscountPublicSchema(
            discount=discount.discount,
            t_start=discount.t_start,
            t_end=discount.t_end,
            active=as_moscow_aware(discount.t_start)
            <= now_moscow
            <= as_moscow_aware(discount.t_end),
        )
        for discount in product.discounts
    ]
    product_stock = get_product_stock(product.id, db)

    return ProductDetailSchema(
        id=product.id,
        product_id=product.id,
        title=product.title,
        description=product.description,
        gender=product.gender,
        ratings=build_rating_from_db(product.id, db),
        reviews=[
            ReviewPublicSchema(review=review.review, estimate=review.estimate)
            for review in product.reviews
        ],
        product_variants=[
            ProductVariantPublicSchema(
                price=variant.price,
                stock=product_stock,
                s=variant.S,
                m=variant.M,
                l=variant.L,
                xl=variant.XL,
                xxl=variant.XXL,
                new=variant.new,
                brand=variant.brand,
                type=variant.product_type,
            )
            for variant in product.product_variants
        ],
        discounts=discounts,
        product_content=[
            ProductContentPublicSchema(
                image=content.image,
                video=content.video,
            )
            for content in product.product_content
        ],
    )
