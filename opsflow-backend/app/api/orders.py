from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderRead])
def list_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    orders = db.execute(select(Order).order_by(Order.created_at.desc())).scalars().all()
    return orders


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    order = Order(item_name=payload.item_name, quantity=payload.quantity)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
