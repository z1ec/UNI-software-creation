from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user_optional, require_admin
from backend.app.models.user import User
from backend.app.repositories.favorite_repository import get_favorite, get_favorite_product_ids
from backend.app.repositories.cart_repository import get_cart_item
from backend.app.repositories.product_repository import (
    add_product_image,
    create_product,
    delete_product,
    get_product_by_id,
    list_products,
    upsert_product_sizes,
    update_product,
)
from backend.app.schemas.product import (
    ProductCreateRequest,
    ProductDetailSchema,
    ProductListItemSchema,
    ProductsPageResponse,
    ProductUpdateRequest,
)
from backend.app.services.product_service import build_product_detail, build_product_list_item

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=ProductsPageResponse)
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    gender: Optional[str] = Query(None),
    is_new: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(connect_db),
):
    skip = (page - 1) * limit
    products, total = list_products(
        db,
        category_id=category_id,
        gender=gender,
        is_new=is_new,
        min_price=min_price,
        max_price=max_price,
        search=search,
        skip=skip,
        limit=limit,
    )
    import math
    pages = max(1, math.ceil(total / limit))
    items = [build_product_list_item(p) for p in products]
    return ProductsPageResponse(items=items, total=total, page=page, pages=pages)


@router.get("/{product_id}", response_model=ProductDetailSchema)
def get_product(
    product_id: int,
    db: Session = Depends(connect_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    is_in_favorites = False
    is_in_cart = False
    if current_user:
        is_in_favorites = get_favorite(db, current_user.id, product_id) is not None
        # Check if any size is in cart
        is_in_cart = any(
            get_cart_item(db, current_user.id, product_id, s.size) is not None
            for s in product.sizes
        )

    return build_product_detail(product, is_in_favorites=is_in_favorites, is_in_cart=is_in_cart)


@router.post("", response_model=ProductDetailSchema, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(
    body: ProductCreateRequest,
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    product = create_product(
        db,
        title=body.title,
        description=body.description,
        brand=body.brand,
        gender=body.gender,
        category_id=body.category_id,
        price=body.price,
        discount=body.discount,
        is_new=body.is_new,
    )
    if body.sizes:
        upsert_product_sizes(db, product.id, [s.model_dump() for s in body.sizes])
    for i, url in enumerate(body.images):
        add_product_image(db, product.id, url, is_primary=(i == 0))
    db.refresh(product)
    return build_product_detail(product)


@router.patch("/{product_id}", response_model=ProductDetailSchema)
def update_product_endpoint(
    product_id: int,
    body: ProductUpdateRequest,
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    product = update_product(db, product_id, **body.model_dump(exclude_none=True))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return build_product_detail(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_endpoint(
    product_id: int,
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    if not delete_product(db, product_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
