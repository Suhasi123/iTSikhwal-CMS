from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, Token, UserResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/login",
    response_model=Token
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    token = AuthService.authenticate_user(
        db=db,
        email=request.email,
        password=request.password,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user