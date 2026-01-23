from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "opsflow-backend"
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/opsflow"
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()
