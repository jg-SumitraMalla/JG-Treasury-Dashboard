"""Main FastAPI application for serving static files."""

import os
import time
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings

# Get settings
settings = get_settings()

# Track server start time
START_TIME = time.time()

# Create FastAPI app
app = FastAPI(
    title="APAC UI File Server",
    description="FastAPI server for serving APAC UI Warehouse static files",
    version="1.0.0",
    docs_url=None,  # Disable docs in production
    redoc_url=None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:9000",
        "https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net",
        "https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
        "uptime": round(time.time() - START_TIME, 2),
        "appEnv": settings.app_env,
        "apiBaseUrl": settings.api_base_url,
        "buildPath": str(settings.build_dir),
    }


@app.get("/ready")
async def readiness_check() -> JSONResponse:
    """Readiness check endpoint - verifies static files exist."""
    if settings.validate_build_path():
        return JSONResponse(
            status_code=200,
            content={
                "status": "ready",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
                "buildPath": str(settings.build_dir),
            }
        )
    else:
        return JSONResponse(
            status_code=503,
            content={
                "status": "not ready",
                "error": "Static files not found",
                "buildPath": str(settings.build_dir),
            }
        )


@app.get("/")
async def root_redirect():
    """Redirect root to the UI base path."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url=settings.base_path)


# Mount static files if build directory exists
if settings.validate_build_path():
    # Serve static assets (js, css, images, etc.)
    app.mount(
        f"{settings.base_path}/assets",
        StaticFiles(directory=settings.build_dir / "assets"),
        name="assets"
    )


@app.get(f"{settings.base_path}/{{full_path:path}}")
async def serve_spa(request: Request, full_path: str):
    """
    Serve the SPA application.
    
    - If the path points to an existing file, serve that file
    - Otherwise, serve index.html for client-side routing
    """
    if not settings.validate_build_path():
        raise HTTPException(
            status_code=503,
            detail="Application not available. Build files not found."
        )
    
    # Check if requesting a specific file
    file_path = settings.build_dir / full_path
    
    if file_path.is_file():
        # Determine media type
        suffix = file_path.suffix.lower()
        media_types = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
            ".eot": "application/vnd.ms-fontobject",
        }
        media_type = media_types.get(suffix, "application/octet-stream")
        return FileResponse(file_path, media_type=media_type)
    
    # For all other paths, serve index.html (SPA fallback)
    return FileResponse(
        settings.index_file,
        media_type="text/html"
    )


@app.get(settings.base_path)
async def serve_spa_root():
    """Serve index.html for the base path."""
    if not settings.validate_build_path():
        raise HTTPException(
            status_code=503,
            detail="Application not available. Build files not found."
        )
    return FileResponse(settings.index_file, media_type="text/html")


def run():
    """Run the server using uvicorn."""
    print("╔═══════════════════════════════════════════════════════════╗")
    print("║           APAC UI File Server (FastAPI)                   ║")
    print("╠═══════════════════════════════════════════════════════════╣")
    print(f"║  App Env:     {settings.app_env:<43}║")
    print(f"║  Server:      http://{settings.host}:{settings.port:<30}║")
    print(f"║  UI Path:     http://{settings.host}:{settings.port}{settings.base_path:<22}║")
    print(f"║  API URL:     {settings.api_base_url[:43]:<43}║")
    print(f"║  Health:      http://{settings.host}:{settings.port}/health{' ' * 19}║")
    print(f"║  Build Path:  {str(settings.build_dir)[:43]:<43}║")
    print("╚═══════════════════════════════════════════════════════════╝")
    
    if not settings.validate_build_path():
        print("\n⚠️  WARNING: Build directory not found or missing index.html!")
        print(f"   Expected path: {settings.build_dir}")
        print("   Please build the container-ui first.\n")
    
    uvicorn.run(
        "file_server.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.app_env == "local",
        log_level="info",
    )


if __name__ == "__main__":
    run()

