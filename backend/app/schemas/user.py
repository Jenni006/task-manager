from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str

    model_config = {"from_attributes": True}


class TokenData(BaseModel):
    user_id: int | None = None