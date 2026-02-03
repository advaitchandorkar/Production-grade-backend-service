"""add order item_id

Revision ID: 0003_add_order_item_id
Revises: 0002_create_inventory_orders
Create Date: 2024-01-01 00:00:02.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0003_add_order_item_id"
down_revision = "0002_create_inventory_orders"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("orders", sa.Column("item_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key(
        "fk_orders_item_id_inventory_items",
        "orders",
        "inventory_items",
        ["item_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade():
    op.drop_constraint("fk_orders_item_id_inventory_items", "orders", type_="foreignkey")
    op.drop_column("orders", "item_id")
