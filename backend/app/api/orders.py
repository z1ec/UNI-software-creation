from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.order import CreateOrderRequest, OrderSchema
from backend.app.services.order_service import checkout, get_my_orders, get_order_detail

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=list[OrderSchema])
def list_my_orders(current_user: User = Depends(get_current_user), db: Session = Depends(connect_db)):
    return get_my_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderSchema)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    return get_order_detail(db, current_user.id, order_id)


@router.post("/checkout", response_model=OrderSchema, status_code=201)
def create_order(
    body: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(connect_db),
):
    return checkout(db, current_user.id, body.delivery_address)
