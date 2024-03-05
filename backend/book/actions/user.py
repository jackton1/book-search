from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas, hashing, token


def get_user_by_email(email: str, db: Session):
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == func.lower(email)).first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the email {email} is not found",
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


def update_password(key: str, password: str, db: Session):
    user_id = token.decode_change_password_token(key)

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the id {user_id} is not found",
        )

    user.password = hashing.Hash.bcrypt(password)
    db.commit()
    db.refresh(user)

    return user


def get_change_password_key(email: str, db: Session):
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == func.lower(email)).first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with the email {email} is not found",
        )

    # Generate a time-based token
    return schemas.GetChangePasswordKey(key=token.create_change_password_token(user.id))
