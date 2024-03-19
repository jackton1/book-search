from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {"status": "ok"}

