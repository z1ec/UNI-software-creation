"""create product tables

Revision ID: 0002_create_product_tables
Create Date: 2026-02-16 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_create_product_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
    )

    op.create_table(
        "product_content",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("image", sa.String(length=512), nullable=True),
        sa.Column("video", sa.String(length=512), nullable=True),
    )

    op.create_table(
        "product_variants",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False),
        sa.Column("s", sa.Integer(), nullable=False),
        sa.Column("m", sa.Integer(), nullable=False),
        sa.Column("l", sa.Integer(), nullable=False),
        sa.Column("xl", sa.Integer(), nullable=False),
        sa.Column("xxl", sa.Integer(), nullable=False),
        sa.CheckConstraint("price > 0", name="ck_product_variants_price_gt_0"),
        sa.CheckConstraint("stock >= 0", name="ck_product_variants_stock_gte_0"),
        sa.CheckConstraint("s >= 0", name="ck_product_variants_s_gte_0"),
        sa.CheckConstraint("m >= 0", name="ck_product_variants_m_gte_0"),
        sa.CheckConstraint("l >= 0", name="ck_product_variants_l_gte_0"),
        sa.CheckConstraint("xl >= 0", name="ck_product_variants_xl_gte_0"),
        sa.CheckConstraint("xxl >= 0", name="ck_product_variants_xxl_gte_0"),
    )

    op.create_table(
        "rating",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("rating_avg", sa.Float(), nullable=True),
        sa.Column("rating_count", sa.Integer(), nullable=True),
        sa.CheckConstraint("rating_avg >= 0", name="ck_rating_avg_gte_0"),
        sa.CheckConstraint("rating_count >= 0", name="ck_rating_count_gte_0"),
    )

    op.create_table(
        "discounts",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("discount", sa.Integer(), nullable=False),
        sa.Column("t_start", sa.Date(), nullable=True),
        sa.Column("t_end", sa.Date(), nullable=True),
        sa.CheckConstraint("discount >= 0", name="ck_discounts_discount_gte_0"),
        sa.CheckConstraint("t_start <= t_end", name="ck_discounts_t_start_lte_t_end"),
    )

    op.create_table(
        "review",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("review", sa.String(length=1024), nullable=True),
        sa.Column("estimate", sa.Integer(), nullable=True),
        sa.CheckConstraint("estimate >= 0", name="ck_review_estimate_gte_0"),
        sa.CheckConstraint("estimate <= 5", name="ck_review_estimate_lte_5"),
    )


def downgrade() -> None:
    op.drop_table("review")
    op.drop_table("discounts")
    op.drop_table("rating")
    op.drop_table("product_variants")
    op.drop_table("product_content")
    op.drop_table("products")
