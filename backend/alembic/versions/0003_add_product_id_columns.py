"""add product_id columns

Revision ID: 0003_add_product_id_columns
Revises: 0002_create_product_tables
Create Date: 2026-02-16 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0003_add_product_id_columns"
down_revision = "0002_create_product_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("product_content", sa.Column("product_id", sa.Integer(), nullable=True))
    op.add_column("product_variants", sa.Column("product_id", sa.Integer(), nullable=True))
    op.add_column("rating", sa.Column("product_id", sa.Integer(), nullable=True))
    op.add_column("discounts", sa.Column("product_id", sa.Integer(), nullable=True))
    op.add_column("review", sa.Column("product_id", sa.Integer(), nullable=True))

    op.create_foreign_key(
        "fk_product_content_product_id",
        "product_content",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_product_variants_product_id",
        "product_variants",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_rating_product_id",
        "rating",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_discounts_product_id",
        "discounts",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_review_product_id",
        "review",
        "products",
        ["product_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_review_product_id", "review", type_="foreignkey")
    op.drop_constraint("fk_discounts_product_id", "discounts", type_="foreignkey")
    op.drop_constraint("fk_rating_product_id", "rating", type_="foreignkey")
    op.drop_constraint("fk_product_variants_product_id", "product_variants", type_="foreignkey")
    op.drop_constraint("fk_product_content_product_id", "product_content", type_="foreignkey")

    op.drop_column("review", "product_id")
    op.drop_column("discounts", "product_id")
    op.drop_column("rating", "product_id")
    op.drop_column("product_variants", "product_id")
    op.drop_column("product_content", "product_id")
