from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.schemas import RegisterRequest, LoginRequest
from utils.auth import get_current_user
import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "platform-secret-key-change-in-prod")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24


def create_token(user: User) -> str:
    payload = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == request.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    if len(request.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    user = User(
        username=request.username,
        password_hash=hash_password(request.password),
        role="user",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user)

    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
        },
    }


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_token(user)

    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
        },
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
    }
