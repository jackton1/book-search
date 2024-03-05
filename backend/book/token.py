import os
from datetime import timedelta, datetime

from fastapi import HTTPException
from jose import jwt, JWTError

from . import schemas

SECRET_KEY = os.environ['SECRET_KEY']
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception: HTTPException) -> schemas.TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    return token_data


def create_change_password_token(id_: int) -> str:
    expiration_time = datetime.utcnow() + timedelta(minutes=30)  # Token expires in 30 minutes
    payload = {
        "user_id": id_,  # Assuming the User model has an id attribute
        "exp": expiration_time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


def decode_change_password_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        expiration = payload.get("exp")
        if user_id is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid token",
            )
        # compare expiration time with current time
        expiration_time = datetime.utcfromtimestamp(expiration)
        if expiration_time < datetime.utcnow():
            raise HTTPException(
                status_code=400,
                detail="Token expired",
            )
    except JWTError:
        raise HTTPException(
            status_code=400,
            detail="Invalid token",
        )

    return user_id
