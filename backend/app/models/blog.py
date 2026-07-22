from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import BlogStatus


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    excerpt: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    cover_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    thumbnail_public_id: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    cover_image_public_id: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    status: Mapped[BlogStatus] = mapped_column(
        Enum(BlogStatus),
        default=BlogStatus.DRAFT,
        nullable=False
    )

    reading_time: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )

    meta_title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    meta_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    seo_keywords: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    show_cta: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False
    )

    author = relationship(
        "User",
        back_populates="blogs"
    )

    category = relationship(
        "Category",
        back_populates="blogs"
    )