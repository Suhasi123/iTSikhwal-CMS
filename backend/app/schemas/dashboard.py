from datetime import datetime
from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_blogs: int
    published_blogs: int
    draft_blogs: int
    archived_blogs: int
    featured_blogs: int
    total_categories: int


class DashboardRecentBlog(BaseModel):
    id: int
    title: str
    status: str
    updated_at: datetime
    category: str | None = None


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_blogs: list[DashboardRecentBlog]