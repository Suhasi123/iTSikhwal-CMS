from sqlalchemy.orm import Session, joinedload

from app.models.blog import Blog
from app.models.category import Category
from app.models.enums import BlogStatus


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session):
        total_blogs = db.query(Blog).count()

        published_blogs = (
            db.query(Blog)
            .filter(Blog.status == BlogStatus.PUBLISHED)
            .count()
        )

        draft_blogs = (
            db.query(Blog)
            .filter(Blog.status == BlogStatus.DRAFT)
            .count()
        )

        archived_blogs = (
            db.query(Blog)
            .filter(Blog.status == BlogStatus.ARCHIVED)
            .count()
        )

        featured_blogs = (
            db.query(Blog)
            .filter(Blog.is_featured == True)
            .count()
        )

        total_categories = db.query(Category).count()

        recent_blogs = (
            db.query(Blog)
            .options(
                joinedload(Blog.category)
            )
            .order_by(Blog.updated_at.desc())
            .limit(5)
            .all()
        )

        return {
            "stats": {
                "total_blogs": total_blogs,
                "published_blogs": published_blogs,
                "draft_blogs": draft_blogs,
                "archived_blogs": archived_blogs,
                "featured_blogs": featured_blogs,
                "total_categories": total_categories,
            },

            "recent_blogs": [
                {
                    "id": blog.id,
                    "title": blog.title,
                    "status": blog.status.value,
                    "updated_at": blog.updated_at,
                    "category": blog.category.name if blog.category else None,
                }
                for blog in recent_blogs
            ]
        }