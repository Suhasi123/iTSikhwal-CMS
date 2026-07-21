import math
from datetime import datetime, timezone
from fastapi import HTTPException

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.models.blog import Blog
from app.models.category import Category
from app.models.enums import BlogStatus
from app.utils.reading_time import calculate_reading_time
from app.utils.slug import generate_slug


class BlogService:

    @staticmethod
    def get_all_blogs(db: Session):
        return (
            db.query(Blog)
            .order_by(Blog.created_at.desc())
            .all()
        )

    @staticmethod
    def get_blog(db: Session, blog_id: int):
        return db.get(Blog, blog_id)
    
    @staticmethod
    def _get_blog_or_404(
        db: Session,
        blog_id: int,
    ) -> Blog:

        blog = (
            db.query(Blog)
            .filter(Blog.id == blog_id)
            .first()
        )

        if blog is None:
            raise HTTPException(
                status_code=404,
                detail="Blog not found"
            )

        return blog

    @staticmethod
    def get_blog_by_slug(db: Session, slug: str):
        return (
            db.query(Blog)
            .filter(Blog.slug == slug)
            .first()
        )

    @staticmethod
    def create_blog(
        db: Session,
        blog_data,
        author_id: int,
    ) -> Blog:

        category = db.get(Category, blog_data.category_id)

        if category is None:
            raise ValueError("Category does not exist")

        slug = BlogService.generate_unique_slug(
            db,
            blog_data.title,
        )

        published_at = None

        if blog_data.status == BlogStatus.PUBLISHED:
            published_at = datetime.now(timezone.utc)

        blog = Blog(
            title=blog_data.title,
            slug=slug,
            excerpt=blog_data.excerpt,
            content=blog_data.content,
            thumbnail_url=blog_data.thumbnail_url,
            cover_image_url=blog_data.cover_image_url,
            status=blog_data.status,
            reading_time=calculate_reading_time(blog_data.content),
            meta_title=blog_data.meta_title,
            meta_description=blog_data.meta_description,
            canonical_url=blog_data.canonical_url,
            seo_keywords=blog_data.seo_keywords,
            is_featured=blog_data.is_featured,
            show_cta=blog_data.show_cta,
            published_at=published_at,
            author_id=author_id,
            category_id=blog_data.category_id,
        )

        db.add(blog)
        db.commit()
        db.refresh(blog)

        return blog
    

    @staticmethod
    def generate_unique_slug(db: Session, title: str) -> str:
        base_slug = generate_slug(title)
        slug = base_slug
        counter = 1

        while BlogService.get_blog_by_slug(db, slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug
    

    @staticmethod
    def update_blog(
        db: Session,
        blog: Blog,
        blog_data,
    ) -> Blog:

        if blog_data.title is not None:
            blog.title = blog_data.title
            if (
                blog_data.title is not None
                and blog.title != blog_data.title
            ):
                blog.title = blog_data.title

                blog.slug = BlogService.generate_unique_slug(
                    db,
                    blog_data.title,
                )

        if blog_data.excerpt is not None:
            blog.excerpt = blog_data.excerpt

        if blog_data.content is not None:
            blog.content = blog_data.content
            blog.reading_time = calculate_reading_time(
                blog_data.content
            )

        if blog_data.thumbnail_url is not None:
            blog.thumbnail_url = blog_data.thumbnail_url

        if blog_data.cover_image_url is not None:
            blog.cover_image_url = blog_data.cover_image_url

        if blog_data.meta_title is not None:
            blog.meta_title = blog_data.meta_title

        if blog_data.meta_description is not None:
            blog.meta_description = blog_data.meta_description

        if blog_data.canonical_url is not None:
            blog.canonical_url = blog_data.canonical_url

        if blog_data.seo_keywords is not None:
            blog.seo_keywords = blog_data.seo_keywords

        if blog_data.category_id is not None:

            category = db.get(Category, blog_data.category_id)

            if category is None:
                raise ValueError("Category does not exist")

            blog.category_id = blog_data.category_id

        if blog_data.is_featured is not None:
            blog.is_featured = blog_data.is_featured

        if blog_data.show_cta is not None:
            blog.show_cta = blog_data.show_cta

        if blog_data.status is not None:

            if (
                blog.status != BlogStatus.PUBLISHED
                and blog_data.status == BlogStatus.PUBLISHED
            ):
                blog.published_at = datetime.now(timezone.utc)

            blog.status = blog_data.status

        db.commit()
        db.refresh(blog)

        return blog



    @staticmethod
    def delete_blog(
        db: Session,
        blog: Blog,
    ):

        db.delete(blog)
        db.commit()


    @staticmethod
    def get_blogs(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
        status: BlogStatus | None = None,
        category: str | None = None,
    ):
        query = (
            db.query(Blog)
            .options(
                joinedload(Blog.author),
                joinedload(Blog.category)
            )
        )

        if search:
            search = f"%{search}%"

            query = query.filter(
                or_(
                    Blog.title.ilike(search),
                    Blog.slug.ilike(search),
                    Blog.excerpt.ilike(search),
                )
            )

        if status:
            query = query.filter(
                Blog.status == status
            )

        if category:
            query = (
                query
                .join(Category)
                .filter(Category.slug == category)
            )

        total_items = query.count()

        blogs = (
            query
            .order_by(Blog.updated_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        total_pages = math.ceil(total_items / page_size) if total_items else 1

        return {
            "items": [
                {
                    "id": blog.id,
                    "title": blog.title,
                    "slug": blog.slug,
                    "status": blog.status,
                    "is_featured": blog.is_featured,
                    "category": blog.category.name if blog.category else None,
                    "author": blog.author.name,
                    "created_at": blog.created_at,
                    "updated_at": blog.updated_at,
                    "published_at": blog.published_at,
                }
                for blog in blogs
            ],

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
    def publish_blog(
        db: Session,
        blog_id: int,
    ):
        blog = BlogService._get_blog_or_404(
            db,
            blog_id,
        )
                
        if blog.status == BlogStatus.PUBLISHED:
            raise HTTPException(
                status_code=400,
                detail="Blog is already published"
            )
        
        blog.status = BlogStatus.PUBLISHED

        if blog.published_at is None:
            blog.published_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(blog)

        return {
            "message": "Blog published successfully"
        }
    

    @staticmethod
    def archive_blog(
        db: Session,
        blog_id: int,
    ):
        blog = BlogService._get_blog_or_404(
            db,
            blog_id
        )

        if blog.status == BlogStatus.ARCHIVED:
            raise HTTPException(
                status_code=400,
                detail="Blog is already archived"
            )
        
        blog.status = BlogStatus.ARCHIVED

        db.commit()
        db.refresh(blog)

        return {
            "message": "Blog archived successfully"
        }
    

    @staticmethod
    def restore_blog(
        db: Session,
        blog_id: int,
    ):
        blog = BlogService._get_blog_or_404(
            db,
            blog_id,
        )

        if blog.status != BlogStatus.ARCHIVED:
            raise HTTPException(
                status_code=400,
                detail="Only archived blogs can be restored"
            )
        
        blog.status = BlogStatus.DRAFT

        db.commit()
        db.refresh(blog)

        return {
            "message": "Blog restored successfully"
        }
    

    @staticmethod
    def feature_blog(
        db: Session,
        blog_id: int,
        is_featured: bool,
    ):
        blog = BlogService._get_blog_or_404(
            db,
            blog_id,
        )

        if blog.is_featured == is_featured:
            state = "featured" if is_featured else "not featured"

            raise HTTPException(
                status_code=400,
                detail=f"Blog is already {state}"
            )
        
        blog.is_featured = is_featured

        db.commit()
        db.refresh(blog)

        return {
            "message": (
                "Blog featured successfully"
                if is_featured
                else "Blog unfeatured successfully"
            )
        }
    

    @staticmethod
    def check_slug_availability(
        db: Session,
        title: str,
    ):
        slug = generate_slug(title)

        existing_blog = (
            db.query(Blog)
            .filter(Blog.slug == slug)
            .first()
        )

        return {
            "slug": slug,
            "available": existing_blog is None,
        }