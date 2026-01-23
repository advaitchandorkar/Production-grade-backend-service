from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.inventory import InventoryItem
from app.schemas.inventory import InventoryCreate, InventoryRead

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=list[InventoryRead])
def list_items(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.execute(select(InventoryItem).order_by(InventoryItem.created_at.desc())).scalars().all()
    return items


@router.post("", response_model=InventoryRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: InventoryCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = InventoryItem(name=payload.name, quantity=payload.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
