from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "opsflow-backend"
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/opsflow"
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    jwt_issuer: str | None = None
    jwt_audience: str | None = None
    cors_origins: list[str] = ["http://localhost:5173"]
    allowed_hosts: list[str] = ["*"]
    environment: str = "development"
    database_pool_size: int = 5
    database_max_overflow: int = 10
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_prefix = ""

    @field_validator("cors_origins", "allowed_hosts", mode="before")
    @classmethod
    def split_csv(cls, value):
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


settings = Settings()
