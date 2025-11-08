# Fess Site Search Generator

[![CI/CD Pipeline](https://github.com/codelibs/fess-site-search/actions/workflows/test.yml/badge.svg)](https://github.com/codelibs/fess-site-search/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

Fess Site Search (FSS) is a customizable JavaScript widget generator that enables you to easily embed powerful search functionality on your website, powered by the [Fess](https://fess.codelibs.org/) search engine.

## 🌟 Features

- **Visual Customization Wizard**: Interactive web interface for customizing colors, fonts, and layout
- **Advanced CSS Support**: Upload custom CSS files for fine-grained control
- **Live Preview**: See your search widget in action before deployment
- **Multi-language**: Support for English and Japanese
- **Vue.js Components**: Modern, responsive search interface built with Vue 3
- **Easy Integration**: Just one JavaScript file to embed on your site

## 🚀 Quick Start

### Try It Online

Visit [FSS Generator](https://fss-generator.codelibs.org/) to create your customized search widget instantly.

### Run with Docker

The fastest way to get started:

```bash
# Build the Docker image
docker build -t fss .

# Run the container
docker run -d -p 5000:5000 fss

# Access the application
open http://localhost:5000
```

### Local Development Setup

#### Prerequisites

- **Python 3.13** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **uv** - Fast Python package installer ([Install](https://github.com/astral-sh/uv))

#### Installation

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone the repository
git clone https://github.com/codelibs/fess-site-search.git
cd fess-site-search

# Run the installation script
chmod +x install.sh
./install.sh
```

#### Running the Development Server

```bash
# Set Flask environment variable
export FLASK_APP=app/__init__.py

# Run with uv
uv run flask run

# Or activate the virtual environment first
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
flask run
```

The application will be available at `http://localhost:5000`.

## 📖 Usage

### Generating a Custom Search Widget

1. **Configure Your Fess Server**
   - Enter your Fess server URL (e.g., `https://search.example.com`)

2. **Customize Appearance**
   - Choose theme colors (background, text, links, borders)
   - Select font family
   - Or upload a custom CSS file

3. **Generate Widget**
   - Click "Generate" to create your customized JavaScript file
   - Preview the search widget with sample queries

4. **Deploy to Your Site**
   - Download the generated `fess-ss-{hash}.min.js` file
   - Add it to your website:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your content here -->

    <!-- Fess Site Search Widget -->
    <div id="fess-search"></div>
    <script src="path/to/fess-ss-{hash}.min.js"></script>
</body>
</html>
```

## 🛠️ Development

### Project Structure

```
fess-site-search/
├── app/                    # Flask backend application
│   ├── views.py           # HTTP route handlers
│   ├── backend.py         # Form processing and build orchestration
│   ├── build_manager.py   # Concurrent build process manager
│   ├── static/            # Static assets (CSS, JS, images)
│   └── templates/         # Jinja2 HTML templates
├── fss/                   # Vue.js frontend application
│   ├── src/               # Vue components and source code
│   ├── public/            # Public assets
│   └── package.json       # Node.js dependencies
├── tests/                 # Test suite
├── pyproject.toml         # Python project configuration
├── Dockerfile             # Docker container definition
└── install.sh             # Installation script
```

### Available Commands

#### Python/Backend

```bash
# Install dependencies
uv sync --all-extras

# Run Flask development server
uv run flask run

# Run tests
uv run pytest -v

# Run linter
uv run ruff check app/ tests/

# Format code
uv run ruff format app/ tests/
```

#### Node.js/Frontend

```bash
cd fss/

# Install dependencies
npm install

# Development server with hot-reload
npm run serve

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Running Tests

```bash
# Run all tests
uv run pytest -v

# Run with coverage
uv run pytest --cov=app --cov-report=html

# Run specific test file
uv run pytest tests/test_status.py -v
```

### Building for Production

#### Docker Image

```bash
# Build optimized production image
docker build -t fss:latest .

# Run in production mode
docker run -d \
  -p 5000:5000 \
  -e APP_WEBPACK_LIMIT=4 \
  --name fss-prod \
  fss:latest
```

#### Manual Build

```bash
# Build frontend
cd fss/
npm run build

# Copy to Flask static directory
mkdir -p ../app/static/fss
cp dist/fess-ss.js ../app/static/fss/

# Run with Gunicorn
cd ..
uv run gunicorn app:app \
  -b 0.0.0.0:5000 \
  -w 4 \
  --threads 12 \
  --preload
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_APP` | Flask application entry point | `app/__init__.py` |
| `FLASK_ENV` | Flask environment (`development`/`production`) | `production` |
| `APP_WEBPACK_LIMIT` | Maximum concurrent webpack builds | `2` |

### Build Configuration

The application supports concurrent build processes with semaphore-based throttling. Adjust `APP_WEBPACK_LIMIT` based on your server resources:

- **Small instances** (1-2 CPU cores): `APP_WEBPACK_LIMIT=2`
- **Medium instances** (4-8 CPU cores): `APP_WEBPACK_LIMIT=4`
- **Large instances** (8+ CPU cores): `APP_WEBPACK_LIMIT=8`

## 📚 Documentation

- **[User Manual](https://fss-generator.codelibs.org/docs/manual)**: Complete guide for using FSS Generator
- **[Technical Specifications](./SPECIFICATIONS.md)**: Detailed technical documentation
- **[Fess Documentation](https://fess.codelibs.org/)**: Learn about the Fess search engine

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`uv run pytest -v`)
5. Run linter (`uv run ruff check . && uv run ruff format .`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 🐛 Bug Reports

If you find a bug, please create an issue on [GitHub Issues](https://github.com/codelibs/fess-site-search/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node.js version)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Fess](https://fess.codelibs.org/)**: Powerful enterprise search engine
- **[Vue.js](https://vuejs.org/)**: Progressive JavaScript framework
- **[Flask](https://flask.palletsprojects.com/)**: Lightweight web framework

## 📞 Support

- **Website**: [fss-generator.codelibs.org](https://fss-generator.codelibs.org/)
- **Documentation**: [User Manual](https://fss-generator.codelibs.org/docs/manual)
- **Issues**: [GitHub Issues](https://github.com/codelibs/fess-site-search/issues)
- **Email**: support@n2sm.net

---

**Made with ❤️ by [CodeLibs Project](https://www.codelibs.org/)**
