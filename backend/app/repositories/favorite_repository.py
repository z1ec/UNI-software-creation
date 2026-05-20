from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.app.models.product import Favorite, Product


def get_favorites(db: Session, user_id: int) -> list[Favorite]:
    return (
        db.execute(
            select(Favorite)
            .options(selectinload(Favorite.product).selectinload(Product.images))
            .where(Favorite.user_id == user_id)
        )
        .scalars()
        .all()
    )


def get_favorite(db: Session, user_id: int, product_id: int) -> Optional[Favorite]:
    return db.execute(
        select(Favorite).where(Favorite.user_id == user_id, Favorite.product_id == product_id)
    ).scalar_one_or_none()


def add_favorite(db: Session, user_id: int, product_id: int) -> Favorite:
    fav = Favorite(user_id=user_id, product_id=product_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


def remove_favorite(db: Session, user_id: int, product_id: int) -> bool:
    fav = get_favorite(db, user_id, product_id)
    if not fav:
        return False
    db.delete(fav)
    db.commit()
    return True


def get_favorite_product_ids(db: Session, user_id: int) -> set[int]:
    rows = db.execute(
        select(Favorite.product_id).where(Favorite.user_id == user_id)
    ).scalars().all()
    return set(rows)
