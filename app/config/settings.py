from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    port: int = 8000
    host: str = "127.0.0.1"

    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "postgres"

    jwt_secret: str = ""
    jwt_refresh_secret: str = ""

    rocket_chat_user: str = ""
    rocket_chat_password: str = ""
    rocket_chat_channel: str = ""
    rocket_chat_server_url: str = ""

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Settings()
