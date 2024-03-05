from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from . import actions, database
from .token import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = verify_token(token, credentials_exception)

    user = actions.user.get_user_by_email(email=token.email, db=db)

    if user is None:
        raise credentials_exception

    return user
