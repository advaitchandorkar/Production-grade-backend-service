import uuid
from datetime import datetime

from pydantic import BaseModel


class InventoryCreate(BaseModel):
    name: str
    quantity: int


class InventoryRead(BaseModel):
    id: uuid.UUID
    name: str
    quantity: int
    created_at: datetime

    class Config:
        from_attributes = True
