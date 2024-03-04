from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas, hashing


def get_user_by_email(email: str, db: Session):
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == func.lower(email)).first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the id {id} is not found",
        )

    return user


def create(user: schemas.User, db: Session):
    existing_user = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == func.lower(user.email)).first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A user already exist with the email {user.email}.",
        )

    new_user = (
        models.User(
            name=user.name,
            email=user.email,
            password=hashing.Hash.bcrypt(user.password),
        )
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
