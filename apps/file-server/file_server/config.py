"""Configuration settings for the file server."""

import os
from pathlib import Path
from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Server settings
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=3000, description="Server port")
    
    # Environment
    app_env: Literal["local", "development", "production"] = Field(
        default="local",
        description="Application environment (local, development, production)"
    )
    
    # Static files path
    build_path: str = Field(
        default="./build/dist",
        description="Path to the UI build folder"
    )
    
    # Base path for serving UI
    base_path: str = Field(
        default="/ui",
        description="Base URL path for serving the UI"
    )
    
    # API URLs for each environment (informational, for health endpoint)
    api_urls: dict = Field(
        default_factory=lambda: {
            "local": "http://localhost:9000",
            "development": "https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net",
            "production": "https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net",
        }
    )
    
    @property
    def api_base_url(self) -> str:
        """Get the API base URL for the current environment."""
        return self.api_urls.get(self.app_env, self.api_urls["local"])
    
    @property
    def build_dir(self) -> Path:
        """Get the build directory as a Path object."""
        return Path(self.build_path).resolve()
    
    @property
    def index_file(self) -> Path:
        """Get the path to index.html."""
        return self.build_dir / "index.html"
    
    def validate_build_path(self) -> bool:
        """Check if the build path exists and contains index.html."""
        return self.build_dir.exists() and self.index_file.exists()

    class Config:
        env_prefix = ""
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

