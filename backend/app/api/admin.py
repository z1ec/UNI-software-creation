from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.db.session import connect_db
from backend.app.dependencies import require_admin
from backend.app.models.user import User
from backend.app.repositories.user_repository import list_users, update_user_role
from backend.app.schemas.order import AdminOrderSchema, UpdateOrderStatusRequest
from backend.app.schemas.user import AdminUserSchema, UpdateUserRoleRequest
from backend.app.services.order_service import admin_list_orders, admin_update_status

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=list[AdminUserSchema])
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    return list_users(db, skip=skip, limit=limit)


@router.patch("/users/{user_id}/role", response_model=AdminUserSchema)
def change_user_role(
    user_id: int,
    body: UpdateUserRoleRequest,
    db: Session = Depends(connect_db),
    current_admin: User = Depends(require_admin),
):
    if body.role not in ("client", "admin"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    user = update_user_role(db, user_id, body.role)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/orders", response_model=list[AdminOrderSchema])
def get_all_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    return admin_list_orders(db, skip=skip, limit=limit)


@router.patch("/orders/{order_id}/status")
def change_order_status(
    order_id: int,
    body: UpdateOrderStatusRequest,
    db: Session = Depends(connect_db),
    _: User = Depends(require_admin),
):
    return admin_update_status(db, order_id, body.status)
