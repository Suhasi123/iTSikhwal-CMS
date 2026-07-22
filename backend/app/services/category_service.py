from slugify import slugify
from sqlalchemy.orm import Session

from app.models.category import Category


class CategoryService:

    @staticmethod
    def create_category(
        db: Session,
        name: str,
        description: str | None,
    ) -> Category:

        slug = slugify(name)

        category = Category(
            name=name,
            slug=slug,
            description=description,
        )

        db.add(category)
        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def get_all_categories(db: Session):

        return (
            db.query(Category)
            .order_by(Category.name)
            .all()
        )

    @staticmethod
    def get_category(
        db: Session,
        category_id: int,
    ):

        return db.get(Category, category_id)

    @staticmethod
    def update_category(
        db: Session,
        category: Category,
        name: str | None,
        description: str | None,
    ) -> Category:

        if name is not None:
            category.name = name
            category.slug = slugify(name)

        if description is not None:
            category.description = description

        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def delete_category(
        db: Session,
        category: Category,
    ):

        db.delete(category)
        db.commit()

    @staticmethod
    def get_by_name(db: Session, name: str) -> Category | None:
        return db.query(Category).filter(Category.name == name).first()


    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Category | None:
        return db.query(Category).filter(Category.slug == slug).first()