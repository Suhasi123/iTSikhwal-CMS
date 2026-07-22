from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from sqlalchemy import or_
import math

from app.models.blog import Blog
from app.models.category import Category
from app.models.enums import BlogStatus


class PublicService:
    
    @staticmethod
    def _base_public_blog_query(db: Session):
        return (
            db.query(Blog)
            .options(
                joinedload(Blog.author),
                joinedload(Blog.category)
            )
            .filter(Blog.status == BlogStatus.PUBLISHED)
        )


    @staticmethod
    def get_published_blogs(
        db: Session,
        category: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 6,
    ):
        query = (
            db.query(Blog)
            .options(
                joinedload(Blog.author),
                joinedload(Blog.category)
            )
            .filter(
                Blog.status == BlogStatus.PUBLISHED
            )
        )

        if category:
            query = query.join(Category).filter(
                Category.slug == category
            )

        if search:
            search = f"%{search}%"

            query = query.filter(
                or_(
                    Blog.title.ilike(search),
                    Blog.excerpt.ilike(search),
                    Blog.seo_keywords.ilike(search),
                )
            )

        total_items = query.count()
        blogs = (
            query
            .order_by(Blog.published_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        total_pages = math.ceil(total_items / page_size) if total_items else 1

        return {
            "items": blogs,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": total_items,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        }

    @staticmethod
    def get_blog_by_slug(
        db: Session,
        slug: str,
    ):
        blog = (
            db.query(Blog)
            .options(
                joinedload(Blog.author),
                joinedload(Blog.category)
            )
            .filter(
                Blog.slug == slug,
                Blog.status == BlogStatus.PUBLISHED
            )
            .first()
        )

        if blog is None:
            return None
        
        previous_blog = (
            db.query(Blog)
            .filter(
                Blog.status == BlogStatus.PUBLISHED,
                Blog.published_at < blog.published_at,
            )
            .order_by(Blog.published_at.desc())
            .first()
        )

        next_blog = (
            db.query(Blog)
            .filter(
                Blog.status == BlogStatus.PUBLISHED,
                Blog.published_at > blog.published_at,
            )
            .order_by(Blog.published_at.asc())
            .first()
        )
        
        related_blogs = (
            db.query(Blog)
            .options(
                joinedload(Blog.category)
            )
            .filter(
                Blog.category_id == blog.category_id,
                Blog.status == BlogStatus.PUBLISHED,
                Blog.id != blog.id,
            )
            .order_by(
                Blog.published_at.desc()
            )
            .limit(3)
            .all()
        )

        keywords = []

        if blog.seo_keywords:
            keywords = [
                keyword.strip()
                for keyword in blog.seo_keywords.split(",")
                if keyword.strip()
            ]

        return {
            "title": blog.title,
            "slug": blog.slug,
            "excerpt": blog.excerpt,
            "content": blog.content,
            "cover_image_url": blog.cover_image_url,
            "reading_time": blog.reading_time,
            "published_at": blog.published_at,
            "updated_at": blog.updated_at,
            "show_cta": blog.show_cta,

            "category": {
                "name": blog.category.name,
                "slug": blog.category.slug,
            },

            "author": {
                "name": blog.author.name,
            },

            "seo": {
                "title": blog.meta_title,
                "description": blog.meta_description,
                "keywords": keywords,
            },

            "previous_blog": (
                {
                    "title": previous_blog.title,
                    "slug": previous_blog.slug,
                }
                if previous_blog
                else None
            ),

            "next_blog": (
                {
                    "title": next_blog.title,
                    "slug": next_blog.slug,
                }
                if next_blog
                else None
            ),

            "related_blogs": related_blogs
        }
        

    @staticmethod
    def get_featured_blogs(db: Session):
        return (
            PublicService._base_public_blog_query(db)
            .filter(Blog.is_featured.is_(True))
            .order_by(Blog.published_at.desc())
            .all()
        )
    

    @staticmethod
    def get_recent_blogs(
        db: Session,
        limit: int = 3,
    ):
        return (
            db.query(Blog)
            .options(
                joinedload(Blog.author),
                joinedload(Blog.category)
            )
            .filter(
                Blog.status == BlogStatus.PUBLISHED
            )
            .order_by(
                Blog.published_at.desc()
            )
            .limit(limit)
            .all()
        )
    

    @staticmethod
    def get_public_categories(db: Session):
        return (
            db.query(
                Category.name,
                Category.slug,
                func.count(Blog.id).label("blog_count")
            )
            .join(
                Blog,
                Blog.category_id == Category.id
            )
            .filter(
                Blog.status == BlogStatus.PUBLISHED
            )
            .group_by(
                Category.id,
                Category.name,
                Category.slug
            )
            .order_by(
                Category.name.asc()
            )
            .all()
        )