from datetime import datetime, timezone

from sqlalchemy.orm import Session

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

        if BlogService.get_blog_by_slug(db, slug):
            raise ValueError("Blog with this title already exists")

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
