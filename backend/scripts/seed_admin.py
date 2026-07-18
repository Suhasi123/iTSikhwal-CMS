import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database.database import SessionLocal
from app.models.user import User


ADMIN_NAME = "Tarun Sikhwal"
ADMIN_EMAIL = "tarun@itsikhwal.com"
ADMIN_PASSWORD = "Admin@123"


def seed_admin():
    db: Session = SessionLocal()

    try:
        existing_user = (
            db.query(User)
            .filter(User.email == ADMIN_EMAIL)
            .first()
        )

        if existing_user:
            print("Admin already exists.")
            return

        admin = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Admin user created successfully!")
        print(f"Email    : {ADMIN_EMAIL}")
        print(f"Password : {ADMIN_PASSWORD}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()