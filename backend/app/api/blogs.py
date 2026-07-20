from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.blog import (
    BlogCreate,
    BlogResponse,
    BlogUpdate,
)
from app.models.enums import BlogStatus
from app.services.blog_service import BlogService
from app.schemas.blog import AdminBlogListResponse

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"],
)


@router.post(
    "",
    response_model=BlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_blog(
    request: BlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return BlogService.create_blog(
            db=db,
            blog_data=request,
            author_id=current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    

@router.get(
    "",
    response_model=AdminBlogListResponse,
)
def get_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = Query(None),
    status: BlogStatus | None = Query(None),
    category: str | None = Query(None),

    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return BlogService.get_blogs(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        category=category,
    )


@router.get(
    "/{blog_id}",
    response_model=BlogResponse,
)
def get_blog(
    blog_id: int,
    db: Session = Depends(get_db),
):

    blog = BlogService.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=404,
            detail="Blog not found",
        )

    return blog


@router.put(
    "/{blog_id}",
    response_model=BlogResponse,
)
def update_blog(
    blog_id: int,
    request: BlogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    blog = BlogService.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=404,
            detail="Blog not found",
        )

    try:
        return BlogService.update_blog(
            db,
            blog,
            request,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
    

@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    blog = BlogService.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=404,
            detail="Blog not found",
        )

    BlogService.delete_blog(
        db,
        blog,
    )


@router.patch("/{blog_id}/publish")
def publish_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return BlogService.publish_blog(
        db=db,
        blog_id=blog_id,
    )


@router.patch("/{blog_id}/archive")
def archive_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return BlogService.archive_blog(
        db,
        blog_id,
    )


@router.patch("/{blog_id}/restore")
def restore_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return BlogService.restore_blog(
        db,
        blog_id,
    )