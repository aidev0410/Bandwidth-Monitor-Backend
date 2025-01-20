from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    port: int = 8000
    host: str = "127.0.0.1"
    env: str = "dev"

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

    logging_config: dict = {
        "version": 1,
        "disable_existing_loggers": True,
        "formatters": {
            "default": {
                "format": "%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s",
                "use_colors": True,
            },
            "custom": {
                "format": "%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s",
                "use_colors": False,
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",  # Default is stderr
            },
            "access": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",  # Default is stderr
            },
            "file_handler": {
                "formatter": "custom",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "logs/app.log",
                "backupCount": 30,
            },
        },
        "loggers": {
            "uvicorn": {"handlers": ["default"], "level": "INFO", "propagate": False},
            "uvicorn.access": {
                "handlers": ["access"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.error": {
                "handlers": ["default"],
                "level": "INFO",
                "propagate": False,
            },
        },
    }

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
