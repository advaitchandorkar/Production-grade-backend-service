import uuid
from datetime import datetime

from pydantic import BaseModel


class OrderCreate(BaseModel):
    item_id: uuid.UUID | None = None
    item_name: str | None = None
    quantity: int


class OrderRead(BaseModel):
    id: uuid.UUID
    item_id: uuid.UUID | None
    item_name: str
    quantity: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
