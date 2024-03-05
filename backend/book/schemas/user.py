from pydantic import BaseModel


class User(BaseModel):
    name: str
    email: str
    password: str

    class Config:
        from_attributes = True


class GetUser(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class ChangePassword(BaseModel):
    key: str
    password: str

    class Config:
        from_attributes = True


class GetChangePasswordKey(BaseModel):
    key: str

    class Config:
        from_attributes = True
