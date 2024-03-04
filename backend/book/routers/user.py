from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import database, schemas, actions
from ..oauth2 import get_current_user

router = APIRouter(tags=["Users"], prefix="/user")


@router.options("/")
def get_user_options():
    return {"methods": ["GET", "POST"]}


@router.post("/", response_model=schemas.GetUser)
def create_user(user: schemas.User, db: Session = Depends(database.get_db)):
    return actions.user.create(user, db)


@router.get("/", response_model=schemas.GetUser)
def get_current_user(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    return current_user
