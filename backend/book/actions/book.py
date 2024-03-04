import json
import os

import requests
from fastapi import HTTPException, status

from .. import schemas

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"
BASE_PARAMS = {
    "key": os.environ["GOOGLE_API_KEY"],
}


def get_all(q: str, page: int) -> schemas.BookSearchResponse:
    try:
        params = {"q": q, **BASE_PARAMS, "startIndex": page * 20, "maxResults": 20}
        response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
        response.raise_for_status()  # Raises an HTTPError if the status is 4xx, 5xx
        data = response.json()
        books = [schemas.BookVolume.parse_obj(item) for item in data.get("items", [])]

        return schemas.BookSearchResponse(kind=data.get("kind"), totalItems=data.get("totalItems"), items=books)
    except requests.HTTPError as e:
        if 400 <= e.response.status_code < 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Google Books API is not available at the moment. Please try again later."
            )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


def get(volume_id: str) -> schemas.BookVolume:
    try:
        response = requests.get(f"{GOOGLE_BOOKS_API_URL}/{volume_id}", params=BASE_PARAMS)
        response.raise_for_status()  # Raises an HTTPError if the status is 4xx, 5xx
        data = response.json()

        return schemas.BookVolume.parse_obj(data)
    except requests.HTTPError as e:
        if 400 <= e.response.status_code < 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Google Books API is not available at the moment. Please try again later."
            )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
