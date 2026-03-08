from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.app.database import connect_db as get_db
from backend.app.schemas import ProductDetailSchema, ProductListItemSchema
from backend.app.services.products_read_service import (
    get_product_payload,
    get_products_payload,
)

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductListItemSchema])
def get_products(db: Session = Depends(get_db)) -> List[ProductListItemSchema]:
    try:
        items = get_products_payload(db)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while reading products",
        ) from exc

    if not items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No complete products found",
        )

    return items


@router.get("/{product_id}", response_model=ProductDetailSchema)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)) -> ProductDetailSchema:
    try:
        product_payload = get_product_payload(product_id, db)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while reading product",
        ) from exc

    if product_payload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id={product_id} not found",
        )

    return product_payload
