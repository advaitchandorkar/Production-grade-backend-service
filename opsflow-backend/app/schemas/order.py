import uuid
from datetime import datetime

from pydantic import BaseModel


class OrderCreate(BaseModel):
    item_name: str
    quantity: int


class OrderRead(BaseModel):
    id: uuid.UUID
    item_name: str
    quantity: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
