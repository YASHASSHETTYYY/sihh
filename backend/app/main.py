from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.mongo import close_mongo_connection, get_mongo_db
from app.db.postgres import engine
from app.models import analytics  # noqa: F401


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = get_mongo_db()
    await db.users.create_index("email", unique=True)
    await db.moods.create_index([("user_id", 1), ("created_at", -1)])

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    await close_mongo_connection()
    await engine.dispose()


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {
        "ok": True,
        "service": settings.app_name,
        "api_prefix": settings.api_v1_prefix,
    }


app.include_router(api_router, prefix=settings.api_v1_prefix)
