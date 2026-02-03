from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.inventory import InventoryItem
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderRead])
def list_orders(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    limit = min(max(limit, 1), 100)
    offset = max(offset, 0)
    orders = (
        db.execute(select(Order).order_by(Order.created_at.desc()).limit(limit).offset(offset))
        .scalars()
        .all()
    )
    return orders


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item_name = payload.item_name
    item_id = payload.item_id

    if not item_name and not item_id:
        raise HTTPException(status_code=400, detail="item_name or item_id is required")

    if item_id:
        item = db.get(InventoryItem, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        if not item_name:
            item_name = item.name

    order = Order(item_name=item_name, quantity=payload.quantity, item_id=item_id)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
