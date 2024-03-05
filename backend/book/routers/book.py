from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from .. import database, schemas, actions
from ..oauth2 import get_current_user

router = APIRouter(tags=["Books"], prefix="/book")


@router.get("/search", response_model=schemas.BookSearchResponse)
def search(
    q: str,
    page: int = 0,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    return actions.book.get_all(q=q, page=page)


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=schemas.BookVolume,
)
def get(
    volume_id: str,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    return actions.book.get(volume_id=volume_id)
