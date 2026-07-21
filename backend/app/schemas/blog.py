from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import BlogStatus
from app.schemas.public_blog import PaginationMeta


class BlogBase(BaseModel):
    title: str
    excerpt: str | None = None
    content: str

    thumbnail_url: str | None = None
    cover_image_url: str | None = None

    thumbnail_public_id: str | None = None
    cover_image_public_id: str | None = None

    status: BlogStatus = BlogStatus.DRAFT

    meta_title: str | None = None
    meta_description: str | None = None
    seo_keywords: str | None = None

    is_featured: bool = False
    show_cta: bool = True

    category_id: int


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None

    thumbnail_url: str | None = None
    cover_image_url: str | None = None

    thumbnail_public_id: str | None = None
    cover_image_public_id: str | None = None

    status: BlogStatus | None = None

    meta_title: str | None = None
    meta_description: str | None = None
    seo_keywords: str | None = None

    is_featured: bool | None = None
    show_cta: bool | None = None

    category_id: int | None = None


class BlogResponse(BlogBase):
    id: int

    slug: str

    reading_time: int

    published_at: datetime | None

    created_at: datetime

    updated_at: datetime

    author_id: int

    model_config = ConfigDict(
        from_attributes=True
    )


class AdminBlogCard(BaseModel):
    id: int
    title: str
    slug: str

    status: BlogStatus
    is_featured: bool

    category: str | None = None
    author: str

    created_at: datetime
    updated_at: datetime
    published_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class AdminBlogListResponse(BaseModel):
    items: list[AdminBlogCard]
    pagination: PaginationMeta


class FeatureBlogRequest(BaseModel):
    is_featured: bool

class SlugAvailabilityResponse(BaseModel):
    slug: str
    available: bool