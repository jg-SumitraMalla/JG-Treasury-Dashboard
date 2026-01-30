# ============================================================================
# APAC UI File Server Dockerfile
# 
# This Dockerfile builds the container-ui and serves it via FastAPI.
# Use --build-arg APP_ENV=development|production to select the build target.
# ============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build the UI
# -----------------------------------------------------------------------------
FROM node:20-alpine AS ui-builder

# Build argument for target environment (development or production)
ARG APP_ENV=production

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
COPY packages/component-warehouse/package.json ./packages/component-warehouse/
COPY apps/container-ui/package.json ./apps/container-ui/

# Create the file-server directory structure for the package script to copy into
RUN mkdir -p ./apps/file-server/build

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/component-warehouse ./packages/component-warehouse
COPY apps/container-ui ./apps/container-ui

# Build component-warehouse first (dependency)
WORKDIR /app/packages/component-warehouse
RUN npm run build

# Build and package the UI based on target environment
# package:dev/prod scripts build and copy dist to ../file-server/build
WORKDIR /app/apps/container-ui
RUN if [ "$APP_ENV" = "development" ]; then \
      echo ">>> Building and packaging UI for DEVELOPMENT environment..." && \
      npm run package:dev; \
    else \
      echo ">>> Building and packaging UI for PRODUCTION environment..." && \
      npm run package:prod; \
    fi


# -----------------------------------------------------------------------------
# Stage 2: Python FastAPI server
# -----------------------------------------------------------------------------
FROM python:3.11-slim AS production

# Build argument for runtime environment
ARG APP_ENV=production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy Python application
COPY apps/file-server/pyproject.toml ./
COPY apps/file-server/file_server ./file_server

# Install Python dependencies (regular install, not editable)
RUN pip install --no-cache-dir .

# Copy the build folder created by package:dev/prod script
# The package script copies dist → ../file-server/build/dist
COPY --from=ui-builder /app/apps/file-server/build ./build

# Set ownership
RUN chown -R appuser:appuser /app

# Environment variables
ENV APP_ENV=${APP_ENV}
ENV HOST=0.0.0.0
ENV PORT=3000
ENV BUILD_PATH=/app/build/dist
ENV BASE_PATH=/ui

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Run the FastAPI server
CMD ["python", "-m", "file_server.main"]
