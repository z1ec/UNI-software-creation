from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from backend.app.models.product import Category, Product, ProductImage, ProductSize


def list_products(
    db: Session,
    *,
    category_id: Optional[int] = None,
    gender: Optional[str] = None,
    is_new: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 40,
) -> tuple[list[Product], int]:
    query = (
        select(Product)
        .options(
            selectinload(Product.images),
            selectinload(Product.sizes),
            selectinload(Product.category),
        )
        .where(Product.is_active.is_(True))
    )

    if category_id is not None:
        query = query.where(Product.category_id == category_id)
    if gender is not None:
        query = query.where(Product.gender == gender)
    if is_new is not None:
        query = query.where(Product.is_new.is_(is_new))
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if search:
        pattern = f"%{search}%"
        query = query.where(
            Product.title.ilike(pattern) | Product.brand.ilike(pattern)
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = db.execute(count_query).scalar_one()

    products = (
        db.execute(query.order_by(Product.created_at.desc()).offset(skip).limit(limit))
        .scalars()
        .all()
    )
    return list(products), total


def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.execute(
        select(Product)
        .options(
            selectinload(Product.images),
            selectinload(Product.sizes),
            selectinload(Product.category),
        )
        .where(Product.id == product_id, Product.is_active.is_(True))
    ).scalar_one_or_none()


def create_product(db: Session, **kwargs) -> Product:
    product = Product(**kwargs)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, **kwargs) -> Optional[Product]:
    product = db.get(Product, product_id)
    if not product:
        return None
    for key, value in kwargs.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> bool:
    product = db.get(Product, product_id)
    if not product:
        return False
    product.is_active = False
    db.commit()
    return True


def list_categories(db: Session) -> list[Category]:
    return db.execute(select(Category).order_by(Category.name)).scalars().all()


def get_category_by_id(db: Session, category_id: int) -> Optional[Category]:
    return db.get(Category, category_id)


def create_category(db: Session, name: str, slug: str) -> Category:
    cat = Category(name=name, slug=slug)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def upsert_product_sizes(db: Session, product_id: int, sizes: list[dict]) -> None:
    existing = db.execute(
        select(ProductSize).where(ProductSize.product_id == product_id)
    ).scalars().all()
    existing_map = {s.size: s for s in existing}

    for size_data in sizes:
        size_key = size_data["size"]
        if size_key in existing_map:
            existing_map[size_key].stock = size_data["stock"]
        else:
            db.add(ProductSize(product_id=product_id, size=size_key, stock=size_data["stock"]))
    db.commit()


def add_product_image(db: Session, product_id: int, url: str, is_primary: bool = False) -> ProductImage:
    img = ProductImage(product_id=product_id, url=url, is_primary=is_primary)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img
