# Build stage for frontend
FROM node:22-slim AS frontend-builder

WORKDIR /app/fss

# Install Node.js dependencies
COPY fss/package.json ./
RUN npm install --no-audit

# Copy frontend source code
COPY fss/jsconfig.json fss/babel.config.js fss/vue.config.js ./
COPY fss/src ./src
COPY fss/public ./public

# Build frontend application
RUN npm run build

# Production stage
FROM python:3.13-slim

LABEL maintainer="CodeLibs Project <support@n2sm.net>"
LABEL org.opencontainers.image.title="Fess Site Search Generator"
LABEL org.opencontainers.image.description="Web service for generating customizable Fess search widgets"
LABEL org.opencontainers.image.source="https://github.com/codelibs/fess-site-search"

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    APP_WEBPACK_LIMIT=4 \
    UV_SYSTEM_PYTHON=1

# Install system dependencies, build tools, and uv
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        gcc \
        g++ \
        make \
        libc6-dev \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && /root/.local/bin/uv --version \
    && rm -rf /var/lib/apt/lists/*

# Add uv to PATH
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Copy Python dependencies configuration and README
COPY pyproject.toml README.md ./

# Install Python dependencies using uv
# Note: Build tools (gcc, g++, make) are kept for potential runtime compilation needs
RUN uv pip install --system -e .

# Copy built frontend files from builder stage
RUN mkdir -p /app/app/static/fss
COPY --from=frontend-builder /app/fss/dist/fess-ss.js /app/app/static/fss/

# Copy Node.js for runtime builds
COPY --from=frontend-builder /usr/local/bin/node /usr/local/bin/
COPY --from=frontend-builder /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Copy frontend build configuration (needed for runtime builds)
COPY fss/package.json /app/fss/
COPY fss/jsconfig.json fss/babel.config.js fss/vue.config.js /app/fss/
COPY fss/src /app/fss/src
COPY fss/public /app/fss/public

# Install Node.js dependencies for runtime builds
WORKDIR /app/fss
RUN npm install --no-audit

# Copy application code
WORKDIR /app
COPY app /app/app
COPY tests /app/tests
COPY instance /app/instance

# Create necessary directories
RUN mkdir -p /app/instance/uploads /app/instance/generates

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Run application with Gunicorn
# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", \
    "-b", "0.0.0.0:5000", \
    "-w", "4", \
    "--threads", "12", \
    "--preload", \
    "--access-logfile", "-", \
    "--error-logfile", "-", \
    "--log-level", "info"]
