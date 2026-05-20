from pydantic import BaseModel, EmailStr


class UserProfileSchema(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

    model_config = {"from_attributes": True}


class UpdateProfileRequest(BaseModel):
    full_name: str


class AdminUserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class UpdateUserRoleRequest(BaseModel):
    role: str
