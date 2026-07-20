from fastapi import APIRouter, Depends, HTTPException
from fastapi import Query
from typing import Annotated
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.public_blog import PublicBlogCard, PublicBlogDetail, PublicCategoryResponse, PublicBlogListResponse
from app.services.public_service import PublicService

router = APIRouter(
    prefix="/public",
    tags=["Public"]
)

@router.get(
    "/blogs",
    response_model=PublicBlogListResponse,
)
def get_blogs(
    category: str | None = Query(
        default=None,
        description="Filter by category slug",
    ),
    search: str | None = Query(
        default=None,
        description="Search by title, excerpt or SEO keywords",
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=6,
        ge=1,
        le=20,
    ),
    db: Session = Depends(get_db),
):
    return PublicService.get_published_blogs(
        db=db,
        category=category,
        search=search,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/blogs/featured",
    response_model=list[PublicBlogCard],
)
def get_featured_blogs(
    db: Session = Depends(get_db),
):
    return PublicService.get_featured_blogs(db)


@router.get(
    "/blogs/recent",
    response_model=list[PublicBlogCard],
)
def get_recent_blogs(
    limit: int = Query(
        default=3,
        ge=1,
        le=20,
        description="Number of recent blogs to return",
    ),
    db: Session = Depends(get_db),
):
    return PublicService.get_recent_blogs(
        db=db,
        limit=limit,
    )


@router.get(
    "/blogs/{slug}",
    response_model=PublicBlogDetail
)
def get_blog_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    blog = PublicService.get_blog_by_slug(
        db,
        slug
    )

    if blog is None:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    return blog


@router.get(
    "/categories",
    response_model=list[PublicCategoryResponse],
)
def get_public_categories(
    db: Session = Depends(get_db),
):
    return PublicService.get_public_categories(db)