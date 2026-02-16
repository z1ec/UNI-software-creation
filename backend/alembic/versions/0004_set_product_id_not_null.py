"""set product_id not null

Revision ID: 0004_set_product_id_not_null
Revises: 0003_add_product_id_columns
Create Date: 2026-02-16 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0004_set_product_id_not_null"
down_revision = "0003_add_product_id_columns"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("product_content", "product_id", existing_type=sa.Integer(), nullable=False)
    op.alter_column("product_variants", "product_id", existing_type=sa.Integer(), nullable=False)
    op.alter_column("rating", "product_id", existing_type=sa.Integer(), nullable=False)
    op.alter_column("discounts", "product_id", existing_type=sa.Integer(), nullable=False)
    op.alter_column("review", "product_id", existing_type=sa.Integer(), nullable=False)


def downgrade() -> None:
    op.alter_column("review", "product_id", existing_type=sa.Integer(), nullable=True)
    op.alter_column("discounts", "product_id", existing_type=sa.Integer(), nullable=True)
    op.alter_column("rating", "product_id", existing_type=sa.Integer(), nullable=True)
    op.alter_column("product_variants", "product_id", existing_type=sa.Integer(), nullable=True)
    op.alter_column("product_content", "product_id", existing_type=sa.Integer(), nullable=True)
