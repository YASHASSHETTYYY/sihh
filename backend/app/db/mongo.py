from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


def get_mongo_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = AsyncIOMotorClient(settings.mongo_uri)
    return _client


def get_mongo_db() -> AsyncIOMotorDatabase:
    global _database
    if _database is None:
        settings = get_settings()
        _database = get_mongo_client()[settings.mongo_db_name]
    return _database


async def close_mongo_connection() -> None:
    global _client, _database
    if _client is not None:
        _client.close()
    _client = None
    _database = None
