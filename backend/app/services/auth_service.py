from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token
from app.models.user import User


class AuthService:

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str
    ) -> str | None:

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return None

        if not verify_password(password, user.password):
            return None

        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role
            }
        )

        return access_token