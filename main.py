import uvicorn

from app.config.settings import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.app:app",
        log_config=settings.logging_config,
        reload=True,
        host=settings.host,
        port=settings.port,
    )
