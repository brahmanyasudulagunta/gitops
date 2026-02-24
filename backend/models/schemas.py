from pydantic import BaseModel
from typing import Optional


class NamespaceRequest(BaseModel):
    namespace: str


class ArgoAppRequest(BaseModel):
    app_name: str
    namespace: str
    image: str


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class InfraRequestResponse(BaseModel):
    id: int
    request_type: str
    payload: dict
    status: str
    created_at: str
    updated_at: str
