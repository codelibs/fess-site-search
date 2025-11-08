.PHONY: help install build test lint format clean docker-build docker-run dev

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Fess Site Search - Development Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Python and Node.js)
	@echo "Installing dependencies..."
	@./install.sh

build: ## Build frontend application
	@echo "Building frontend..."
	@cd fss && npm run build
	@mkdir -p app/static/fss
	@cp fss/dist/fess-ss.js app/static/fss/

test: ## Run all tests
	@echo "Running tests..."
	@uv run pytest -v

test-cov: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	@uv run pytest --cov=app --cov-report=html --cov-report=term-missing

lint: ## Run linters (Python and JavaScript)
	@echo "Linting Python code..."
	@uv run ruff check app/ tests/
	@echo "Linting JavaScript code..."
	@cd fss && npm run lint

format: ## Format code (Python and JavaScript)
	@echo "Formatting Python code..."
	@uv run ruff format app/ tests/
	@echo "Formatting JavaScript code..."
	@cd fss && npm run lint:fix

clean: ## Clean build artifacts and cache files
	@echo "Cleaning build artifacts..."
	@rm -rf .pytest_cache .ruff_cache htmlcov .coverage
	@rm -rf fss/dist fss/node_modules
	@rm -rf app/static/fss/fess-ss.js
	@rm -rf instance/uploads/* instance/generates/*
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@find . -type f -name "*.pyo" -delete
	@echo "Clean complete!"

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	@docker build -t fss:latest .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	@docker run -d -p 5000:5000 --name fss fss:latest
	@echo "Container started! Access at http://localhost:5000"

docker-stop: ## Stop Docker container
	@echo "Stopping Docker container..."
	@docker stop fss || true
	@docker rm fss || true

dev: ## Start development server
	@echo "Starting development server..."
	@export FLASK_APP=app/__init__.py && export FLASK_ENV=development && uv run flask run

dev-frontend: ## Start frontend development server
	@echo "Starting frontend development server..."
	@cd fss && npm run serve

check: lint test ## Run linters and tests

setup-uv: ## Install uv package manager
	@echo "Installing uv..."
	@curl -LsSf https://astral.sh/uv/install.sh | sh
	@echo "uv installed successfully!"

sync: ## Sync dependencies with uv
	@echo "Syncing dependencies..."
	@uv sync --all-extras

validate: ## Validate configuration files
	@echo "Validating pyproject.toml..."
	@python3 -c "import tomllib; tomllib.load(open('pyproject.toml', 'rb'))" && echo "✓ pyproject.toml is valid"
	@echo "Validating package.json..."
	@node -e "JSON.parse(require('fs').readFileSync('fss/package.json'))" && echo "✓ package.json is valid"
	@echo "Checking Python syntax..."
	@python3 -m py_compile app/*.py && echo "✓ Python files compile successfully"

all: install build test ## Install, build, and test everything
