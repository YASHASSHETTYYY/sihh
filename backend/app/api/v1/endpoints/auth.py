from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.mongo import get_mongo_db
from app.schemas.common import TokenResponse, UserCreate, UserLogin, UserOut


router = APIRouter()


def _user_out(doc: dict) -> UserOut:
    return UserOut(
        id=doc["_id"],
        full_name=doc["full_name"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
    )


@router.post("/register", response_model=TokenResponse)
async def register(payload: UserCreate) -> TokenResponse:
    db = get_mongo_db()

    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    resolved_name = (payload.full_name or payload.name or "User").strip()

    user_id = str(uuid4())
    user_doc = {
        "_id": user_id,
        "full_name": resolved_name,
        "email": payload.email.lower(),
        "password_hash": get_password_hash(payload.password),
        "role": "user",
        "dob": payload.dob,
        "age": payload.age,
        "college": payload.college,
        "issues": payload.issues or [],
        "about": payload.about,
        "created_at": datetime.utcnow(),
    }
    await db.users.insert_one(user_doc)

    token = create_access_token(subject=user_id)
    return TokenResponse(access_token=token, user=_user_out(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin) -> TokenResponse:
    db = get_mongo_db()
    user_doc = await db.users.find_one({"email": payload.email.lower()})
    if not user_doc or not verify_password(payload.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user_doc["_id"])
    return TokenResponse(access_token=token, user=_user_out(user_doc))


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)) -> UserOut:
    return _user_out(current_user)
