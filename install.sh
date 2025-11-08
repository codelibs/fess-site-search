#!/bin/bash -eux

# Fess Site Search Installation Script
# This script sets up the development environment for both backend and frontend

SCRIPT_DIR=$(cd $(dirname $0); pwd)

echo "==> Installing Fess Site Search development environment"

# Check for required commands
command -v uv >/dev/null 2>&1 || {
    echo "Error: uv is not installed. Please install it first:"
    echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
}

command -v node >/dev/null 2>&1 || {
    echo "Error: Node.js is not installed. Please install Node.js 18 or later."
    exit 1
}

# Install Python dependencies using uv
echo "==> Installing Python dependencies with uv"
cd "${SCRIPT_DIR}"
uv sync --all-extras

# Install Node.js dependencies
echo "==> Installing Node.js dependencies"
cd "${SCRIPT_DIR}/fss"
npm install

# Build frontend
echo "==> Building Vue.js application"
npm run build

# Copy built files to Flask static directory
echo "==> Copying built files to Flask static directory"
mkdir -p "${SCRIPT_DIR}/app/static/fss"
cp "${SCRIPT_DIR}/fss/dist/fess-ss.js" "${SCRIPT_DIR}/app/static/fss/"

# Create instance directories
echo "==> Creating instance directories"
mkdir -p "${SCRIPT_DIR}/instance/uploads"
mkdir -p "${SCRIPT_DIR}/instance/generates"

echo ""
echo "✓ Installation complete!"
echo ""
echo "To start the development server:"
echo "  export FLASK_APP=app/__init__.py"
echo "  uv run flask run"
echo ""
echo "Or use Docker:"
echo "  docker build -t fss ."
echo "  docker run -d -p 5000:5000 fss"
echo ""
