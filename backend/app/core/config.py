from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="backend/.env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="EchoWell Intelligence API", alias="APP_NAME")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")
    debug: bool = Field(default=False, alias="DEBUG")

    secret_key: str = Field(default="change-this-secret", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=60 * 24 * 7, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    mongo_uri: str = Field(default="mongodb://localhost:27017", alias="MONGO_URI")
    mongo_db_name: str = Field(default="echowell", alias="MONGO_DB_NAME")

    postgres_uri: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/echowell_analytics",
        alias="POSTGRES_URI",
    )

    ml_artifact_dir: str = Field(default="backend/app/ml/artifacts", alias="ML_ARTIFACT_DIR")
    hf_emotion_model: str = Field(default="bhadresh-savani/bert-base-uncased-emotion", alias="HF_EMOTION_MODEL")

    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-1.5-flash", alias="GEMINI_MODEL")

    allowed_origins: str = Field(default="http://localhost:5173", alias="ALLOWED_ORIGINS")

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        text = str(value).strip().lower()
        if text in {"1", "true", "yes", "on", "debug"}:
            return True
        return False

    @property
    def artifact_path(self) -> Path:
        return Path(self.ml_artifact_dir)

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
