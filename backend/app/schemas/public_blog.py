from datetime import datetime
from math import ceil
from pydantic import BaseModel, ConfigDict


class PublicCategory(BaseModel):
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class PublicAuthor(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class PublicBlogCard(BaseModel):
    title: str
    slug: str
    excerpt: str | None

    thumbnail_url: str | None

    reading_time: int

    published_at: datetime

    is_featured: bool

    category: PublicCategory

    author: PublicAuthor

    model_config = ConfigDict(from_attributes=True)


class PublicSEO(BaseModel):
    title: str | None = None
    description: str | None = None
    canonical: str | None = None
    keywords: list[str] = []


class RelatedBlog(BaseModel):
    title: str
    slug: str
    thumbnail_url: str | None = None
    reading_time: int
    published_at: datetime

    category: PublicCategory

    model_config = ConfigDict(from_attributes=True)


class BlogNavigation(BaseModel):
    title: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class PublicBlogDetail(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None

    content: str

    cover_image_url: str | None = None

    reading_time: int

    published_at: datetime
    updated_at: datetime

    show_cta: bool

    category: PublicCategory

    author: PublicAuthor

    seo: PublicSEO

    previous_blog: BlogNavigation | None = None

    next_blog: BlogNavigation | None = None

    related_blogs: list[RelatedBlog]

    model_config = ConfigDict(from_attributes=True)


class PublicCategoryResponse(BaseModel):
    name: str
    slug: str
    blog_count: int


class PaginationMeta(BaseModel):
    page: int
    page_size: int

    total_items: int
    total_pages: int

    has_next: bool
    has_previous: bool


class PublicBlogListResponse(BaseModel):
    items: list[PublicBlogCard]
    pagination: PaginationMeta



