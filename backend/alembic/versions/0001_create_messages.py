"""create messages table

Revision ID: 0001_create_messages
Revises: None
Create Date: 2026-02-15 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_create_messages"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("text", sa.String(length=255), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("messages")
