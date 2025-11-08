# Fess Site Search (FSS) - Technical Specifications

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. System Architecture](#2-system-architecture)
- [3. Technology Stack](#3-technology-stack)
- [4. Functional Requirements](#4-functional-requirements)
- [5. API Specifications](#5-api-specifications)
- [6. Build and Deployment](#6-build-and-deployment)
- [7. Configuration Management](#7-configuration-management)
- [8. Testing Requirements](#8-testing-requirements)
- [9. Security Considerations](#9-security-considerations)
- [10. Performance Requirements](#10-performance-requirements)

---

## 1. Project Overview

### 1.1 Purpose

Fess Site Search (FSS) is a JavaScript widget generator service that enables website owners to embed customizable search functionality powered by the [Fess](https://fess.codelibs.org/) search engine. The project consists of:

- **FSS Generator Web Application**: A web interface for creating and customizing search widgets
- **JavaScript Widget Library**: A Vue.js-based embeddable search component
- **Backend API Service**: Flask-based service for configuration generation and build management

### 1.2 Key Features

- **Visual Customization Wizard**: Interactive form for customizing colors, fonts, and layout
- **Advanced CSS Upload**: Support for uploading custom CSS files for fine-grained control
- **Live Preview**: Real-time demo of the generated search widget
- **Multi-language Support**: English and Japanese interface
- **Responsive Design**: Mobile-friendly search components
- **Theme Generation**: Automatic generation of themed JavaScript files

### 1.3 Target Audience

- Website administrators wanting to add search functionality
- Developers integrating Fess search into websites
- Content managers requiring customizable search interfaces

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐
│   Web Browser   │
│  (End User UI)  │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────────────────────────────┐
│         Flask Web Application           │
│  ┌────────────┐      ┌──────────────┐  │
│  │   Routes   │◄────►│   Backend    │  │
│  │  (views.py)│      │  (backend.py)│  │
│  └────────────┘      └──────┬───────┘  │
│                             │           │
│  ┌────────────────────────┐ │           │
│  │   Build Manager        │◄┘           │
│  │  (build_manager.py)    │             │
│  └──────────┬─────────────┘             │
└─────────────┼───────────────────────────┘
              │ Fork & Execute
              ▼
┌───────────────────────────────────────┐
│      Node.js Build Process            │
│  ┌─────────────────────────────────┐  │
│  │   Vue CLI Build Service         │  │
│  │  ┌──────────────────────────┐   │  │
│  │  │  Webpack Bundler         │   │  │
│  │  └──────────────────────────┘   │  │
│  └─────────────────────────────────┘  │
└─────────────────┬─────────────────────┘
                  │ Output
                  ▼
┌────────────────────────────────────────┐
│     Generated JavaScript Files         │
│  instance/generates/fess-ss-*.min.js   │
└────────────────────────────────────────┘
```

### 2.2 Component Interaction Flow

1. **User Request Flow**:
   ```
   User Form Submission → Flask Route → Backend Handler → Config Generation → Build Manager
   → Fork Process → Vue CLI Build → Webpack Compile → Output JS File → Redirect to Demo
   ```

2. **File Generation Flow**:
   ```
   Custom Colors/CSS → generate_config.py → JSON Config + CSS Rules → Vue Environment Variables
   → Webpack Build → Minified fess-ss-{hash}.min.js → Static File Storage
   ```

### 2.3 Directory Structure

```
fess-site-search/
├── app/                              # Flask backend application
│   ├── __init__.py                   # App factory and initialization
│   ├── app.py                        # Flask app configuration
│   ├── views.py                      # HTTP route handlers
│   ├── backend.py                    # Form processing and build orchestration
│   ├── build_manager.py              # Concurrent build process manager
│   ├── generate_config.py            # Configuration file generator
│   ├── custom_config_rules.py        # CSS/JSON customization rules
│   ├── docs/                         # Markdown documentation files
│   │   ├── overview.en.md
│   │   ├── overview.ja.md
│   │   ├── user-manual.en.md
│   │   └── user-manual.ja.md
│   ├── static/                       # Static assets
│   │   ├── css/                      # Application stylesheets
│   │   ├── img/                      # Images and logos
│   │   └── fss/                      # Base FSS JavaScript library
│   └── templates/                    # Jinja2 HTML templates
│       ├── base.html
│       ├── generator.html
│       ├── demo.html
│       └── search.html
├── fss/                              # Vue.js frontend application
│   ├── src/                          # Vue source code
│   │   ├── components/               # Vue components
│   │   │   ├── SearchForm.vue
│   │   │   ├── SearchResult.vue
│   │   │   └── SuggestBox.vue
│   │   ├── lib/                      # Utility libraries
│   │   └── openapi/                  # Generated API clients
│   ├── public/                       # Public assets
│   ├── package.json                  # Node.js dependencies
│   ├── vue.config.js                 # Vue CLI configuration
│   ├── babel.config.js               # Babel transpiler config
│   └── .eslintrc.json                # ESLint code quality rules
├── instance/                         # Flask instance folder (gitignored)
│   ├── uploads/                      # User-uploaded CSS files
│   └── generates/                    # Generated JavaScript files
├── tests/                            # Test suite
│   ├── test_status.py                # HTTP endpoint integration tests
│   └── test_FSS_generator.py         # Generator functionality tests
├── requirements.txt                  # Python dependencies
├── Dockerfile                        # Docker container definition
├── install.sh                        # Local development setup script
└── README.md                         # Project documentation
```

---

## 3. Technology Stack

### 3.1 Backend Stack

#### Core Framework
- **Flask ≥3.1.0**: Lightweight WSGI web application framework
  - Routing and request handling
  - Template rendering with Jinja2
  - Static file serving

#### Python Libraries
- **Gunicorn ≥23.0.0**: Production-grade WSGI HTTP server
  - Multi-worker process manager
  - Thread pooling for concurrent requests

- **cssutils ≥2.11.1**: CSS parser and manipulation library
  - Parsing uploaded CSS files
  - Validating CSS syntax
  - Extracting custom rules

- **pycmarkgfm ≥1.2.1**: GitHub Flavored Markdown parser
  - Converting documentation files to HTML
  - Preserving markdown formatting

- **pygments ≥2.18.0**: Syntax highlighting library
  - Code highlighting in documentation

- **pytest ≥8.3.4**: Testing framework
  - Unit and integration tests
  - Test fixtures and assertions
  - Coverage reporting

### 3.2 Frontend Stack

#### Core Framework
- **Vue.js ^3.5.13**: Progressive JavaScript framework
  - Component-based architecture
  - Reactive data binding
  - Virtual DOM rendering

#### Vue Ecosystem
- **Vue CLI ~5.0.8**: Standard tooling for Vue development
  - Project scaffolding
  - Build orchestration
  - Plugin management

- **Webpack ^5.97.1** (via Vue CLI): Module bundler
  - JavaScript bundling and minification
  - SCSS preprocessing
  - Asset optimization

#### JavaScript Libraries
- **Axios ^1.7.9**: Promise-based HTTP client
  - AJAX requests to Fess API
  - Request/response interceptors

- **@babel/cli ^7.25.9**: JavaScript transpiler
  - ES6+ to ES5 compilation
  - Browser compatibility

- **core-js ^3.39.0**: Polyfill library
  - ES6+ feature polyfills
  - Browser compatibility

#### Styling
- **Sass ^1.81.0**: CSS preprocessor
  - SCSS syntax support
  - Variable-based theming
  - Nested selectors

- **sass-loader ^16.0.3**: Webpack loader for Sass
  - SCSS compilation
  - Source maps support

#### Code Quality
- **ESLint ^8.57.1**: JavaScript linter
  - Code quality enforcement
  - Vue.js-specific rules
  - Automatic error detection

- **eslint-plugin-vue ^9.31.0**: Vue-specific ESLint rules
  - Vue 3 best practices
  - Component structure validation

### 3.3 Development Tools

- **Node.js ≥18 (22 recommended)**: JavaScript runtime
- **npm ≥9**: Package manager
- **Python ≥3.11 (3.13 recommended)**: Application runtime
- **uv**: Fast Python package installer and resolver
- **Docker**: Containerization platform
- **Git**: Version control

---

## 4. Functional Requirements

### 4.1 FSS Generator Web Interface

#### FR-1: Homepage
**Description**: Display project overview with navigation to generator and documentation

**Requirements**:
- Support English (`/`) and Japanese (`/ja/`) versions
- Render markdown content from `overview.{en,ja}.md`
- Display navigation menu with links to generator and manual
- Show project logo and branding

#### FR-2: User Manual
**Description**: Display comprehensive usage documentation

**Requirements**:
- Support English (`/docs/manual`) and Japanese (`/ja/docs/manual`) versions
- Render markdown content from `user-manual.{en,ja}.md`
- Support code syntax highlighting
- Include screenshots and examples

#### FR-3: Generator Wizard (GET /generator)
**Description**: Interactive form for customizing FSS widget appearance

**Requirements**:
- **Input Fields**:
  - Fess Server URL (required, text input)
  - Theme colors:
    - Background color (color picker)
    - Text color (color picker)
    - Link color (color picker)
    - Border color (color picker)
  - Font selection (dropdown):
    - Sans-serif
    - Serif
    - Monospace
  - Custom CSS file upload (optional, file input)

- **Validation**:
  - Fess URL must be valid HTTP/HTTPS URL
  - Color values must be valid hex colors
  - CSS file must be valid CSS syntax

- **UI/UX**:
  - Real-time color preview
  - Responsive layout (mobile-friendly)
  - Clear form labels and help text

#### FR-4: Configuration Generation (POST /generator)
**Description**: Process form submission and generate custom FSS JavaScript file

**Requirements**:
- Accept form data or CSS file upload
- Generate unique hash for configuration
- Create JSON configuration file
- Create CSS customization file
- Trigger asynchronous build process
- Redirect to demo page with status polling

**Output**:
- Redirect URL: `/demo/{hash}`
- Generated files:
  - `instance/generates/config-{hash}.json`
  - `instance/generates/config-{hash}.css`
  - `instance/generates/fess-ss-{hash}.min.js`

#### FR-5: Demo Page (GET /demo/{fname})
**Description**: Preview generated FSS widget with sample search

**Requirements**:
- Load generated JavaScript file: `fess-ss-{fname}.min.js`
- Embed search widget in iframe
- Display download button for JavaScript file
- Show integration instructions
- Provide sample HTML code snippet
- Display build status (building/ready)

**AJAX Polling**:
- Endpoint: `/api/check_js/{fname}`
- Interval: 2 seconds
- Timeout: 60 seconds
- Response: `{"result": true/false}`

#### FR-6: Search Preview (GET /search/{fname})
**Description**: Iframe content showing functional search widget

**Requirements**:
- Load custom FSS JavaScript file
- Initialize search widget
- Execute sample query: `test`
- Display search results from configured Fess server
- Show pagination controls
- Display search suggestions

### 4.2 FSS JavaScript Widget

#### FR-7: Search Form Component
**Description**: Input field with auto-suggest functionality

**Requirements**:
- **Input Features**:
  - Text input with placeholder
  - Auto-suggest dropdown on typing
  - Keyboard navigation (arrow keys, Enter, Escape)
  - Configurable suggestion count (default: 5)

- **Auto-suggest**:
  - Trigger after 2+ characters
  - Debounce delay: 300ms
  - Display suggestion labels
  - Highlight matching text

- **Events**:
  - Submit on Enter key
  - Submit on search button click
  - Clear on Escape key

#### FR-8: Search Result Component
**Description**: Display search results with pagination

**Requirements**:
- **Result Display**:
  - Title with link to original page
  - Content snippet (150 characters max)
  - Thumbnail image (if available)
  - URL breadcrumb
  - Highlight search terms in snippets

- **Pagination**:
  - Configurable page size (default: 20)
  - Previous/Next buttons
  - Page number display
  - Total results count

- **Features**:
  - Favorites toggle (if enabled)
  - Related queries section
  - "No results" message
  - Loading spinner during search

#### FR-9: Customization Support
**Description**: Apply user-defined styles and configuration

**Requirements**:
- **Theme Configuration**:
  - Background colors for header, body, footer
  - Text colors for titles, content, links
  - Border colors and widths
  - Font family selection

- **CSS Injection**:
  - Load custom CSS file
  - Override default styles
  - Preserve component functionality

- **Configuration Options**:
  ```json
  {
    "fessUrl": "https://search.example.com",
    "fessContextPath": "/",
    "fessSearchPagePath": "/search",
    "fessThumnailPath": "/thumbnail",
    "colors": {
      "background": "#ffffff",
      "text": "#333333",
      "link": "#0066cc",
      "border": "#cccccc"
    },
    "font": "sans-serif"
  }
  ```

---

## 5. API Specifications

### 5.1 HTTP Endpoints

#### GET /
**Description**: Homepage (English)

**Response**: HTML page with overview content

**Status Codes**:
- `200 OK`: Successfully rendered

---

#### GET /ja/
**Description**: Homepage (Japanese)

**Response**: HTML page with Japanese overview content

**Status Codes**:
- `200 OK`: Successfully rendered

---

#### GET /docs/manual
**Description**: User manual (English)

**Response**: HTML page with manual content

**Status Codes**:
- `200 OK`: Successfully rendered

---

#### GET /ja/docs/manual
**Description**: User manual (Japanese)

**Response**: HTML page with Japanese manual content

**Status Codes**:
- `200 OK`: Successfully rendered

---

#### GET /generator
**Description**: Generator wizard form

**Response**: HTML page with customization form

**Status Codes**:
- `200 OK`: Successfully rendered

---

#### POST /generator
**Description**: Generate custom FSS JavaScript file

**Request Body** (Wizard Mode):
```
Content-Type: application/x-www-form-urlencoded

fessUrl=https://search.example.com
&bgColor=#ffffff
&textColor=#333333
&linkColor=#0066cc
&borderColor=#cccccc
&font=sans-serif
```

**Request Body** (Upload Mode):
```
Content-Type: multipart/form-data

fessUrl=https://search.example.com
&file=custom.css (CSS file)
```

**Response**:
```
HTTP/1.1 302 Found
Location: /demo/{hash}
```

**Status Codes**:
- `302 Found`: Redirect to demo page
- `400 Bad Request`: Invalid form data
- `500 Internal Server Error`: Build process failure

---

#### GET /demo/{fname}
**Description**: Demo page for generated widget

**Parameters**:
- `fname`: Hash identifier for generated file

**Response**: HTML page with widget demo

**Status Codes**:
- `200 OK`: Successfully rendered
- `404 Not Found`: Invalid hash

---

#### GET /search/{fname}
**Description**: Search widget iframe content

**Parameters**:
- `fname`: Hash identifier for generated file

**Query Parameters**:
- `fss.query`: Search query string (optional)

**Response**: HTML page with search widget

**Status Codes**:
- `200 OK`: Successfully rendered
- `404 Not Found`: Invalid hash

---

#### GET /api/check_js/{fname}
**Description**: Check if generated JavaScript file exists

**Parameters**:
- `fname`: Hash identifier for generated file

**Response**:
```json
{
  "result": true
}
```

**Status Codes**:
- `200 OK`: Check completed
- `404 Not Found`: Invalid hash

---

### 5.2 Fess API Integration

The FSS widget communicates with Fess search engine via REST API:

#### Search API
**Endpoint**: `{fessUrl}/json`

**Method**: `GET`

**Query Parameters**:
- `q`: Search query string
- `start`: Result offset (for pagination)
- `num`: Number of results per page

**Response**:
```json
{
  "response": {
    "q": "search query",
    "start": 0,
    "num": 20,
    "total": 100,
    "docs": [
      {
        "id": "doc_id",
        "title": "Document Title",
        "content": "Document content snippet...",
        "url": "https://example.com/page",
        "thumbnail": "https://example.com/thumb.jpg"
      }
    ],
    "related": ["related query 1", "related query 2"]
  }
}
```

#### Suggest API
**Endpoint**: `{fessUrl}/suggest`

**Method**: `GET`

**Query Parameters**:
- `q`: Partial query string

**Response**:
```json
{
  "suggest": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}
```

---

## 6. Build and Deployment

### 6.1 Local Development Setup

#### Prerequisites
- Python 3.8+
- Node.js 18+
- npm 9+

#### Installation Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/codelibs/fess-site-search.git
   cd fess-site-search
   ```

2. **Run Installation Script**:
   ```bash
   ./install.sh
   ```

   This script performs:
   - Installs Python dependencies from `requirements.txt`
   - Installs Node.js dependencies in `fss/` directory
   - Builds Vue.js application
   - Copies `fess-ss.js` to `app/static/fss/`

3. **Start Development Server**:
   ```bash
   export FLASK_APP=app/__init__.py
   flask run
   ```

   Access at: `http://localhost:5000`

#### Development Workflow

**Backend Development**:
```bash
# Make changes to Python files in app/
# Flask auto-reloads on file changes (debug mode)
export FLASK_ENV=development
flask run
```

**Frontend Development**:
```bash
cd fss/
npm run serve  # Hot-reload development server on port 8080
```

**Run Tests**:
```bash
pytest -v ./tests
```

### 6.2 Docker Deployment

#### Build Docker Image

```bash
docker build -t fss .
```

**Build Process** (Multi-stage):

**Stage 1: Frontend Builder**
1. Base image: `node:22-slim`
2. Install Node.js dependencies with `npm ci`
3. Copy Vue.js source code
4. Run `npm run build` to create production bundle

**Stage 2: Production Image**
1. Base image: `python:3.13-slim`
2. Install system dependencies (curl, ca-certificates)
3. Install uv package manager
4. Install Python dependencies using uv
5. Copy built frontend assets from Stage 1
6. Copy Node.js runtime for dynamic builds
7. Install Node.js dependencies for runtime builds
8. Copy application code
9. Create instance directories
10. Expose port 5000
11. Configure health check
12. Set environment variables

#### Run Docker Container

```bash
docker run -d -p 5000:5000 fss
```

**Container Configuration**:
- **Port**: 5000 (HTTP)
- **Workers**: 4 Gunicorn workers
- **Threads**: 12 threads per worker
- **Environment Variables**:
  - `APP_WEBPACK_LIMIT=4`: Maximum concurrent build processes

#### Production Command

```bash
gunicorn app:app \
  -b 0.0.0.0:5000 \
  -w 4 \
  --threads 12 \
  --preload \
  --log-file -
```

**Gunicorn Configuration**:
- `--preload`: Load application before forking workers (required for shared semaphore)
- `-w 4`: 4 worker processes
- `--threads 12`: 12 threads per worker
- `--log-file -`: Log to stdout

### 6.3 Build Process Management

#### Build Manager Architecture

**File**: `app/build_manager.py`

**Purpose**: Manage concurrent webpack build processes with semaphore-based concurrency control

**Key Features**:

1. **Semaphore Limiting**:
   ```python
   WEBPACK_LIMIT = int(os.getenv('APP_WEBPACK_LIMIT', 2))
   webpack_semaphore = multiprocessing.Semaphore(WEBPACK_LIMIT)
   ```
   - Limits concurrent builds to prevent resource exhaustion
   - Default: 2 concurrent builds
   - Configurable via `APP_WEBPACK_LIMIT` environment variable

2. **Process Forking**:
   ```python
   pid = os.fork()
   if pid == 0:
       # Child process: run webpack build
       os.execve(npm_cmd, args, env)
   ```
   - Forks child process for each build
   - Parent returns immediately (non-blocking)
   - Child process runs webpack via `npm run build`

3. **Build Flow**:
   ```
   User Request → Acquire Semaphore → Fork Process → Run Webpack
   → Generate JS File → Move to instance/generates/ → Release Semaphore
   ```

#### Configuration Generation

**File**: `app/generate_config.py`

**Functions**:

1. **Color Customization**:
   ```python
   def generate_colors(form_data):
       return {
           'background': form_data.get('bgColor', '#ffffff'),
           'text': form_data.get('textColor', '#333333'),
           'link': form_data.get('linkColor', '#0066cc'),
           'border': form_data.get('borderColor', '#cccccc')
       }
   ```

2. **CSS Generation**:
   ```python
   def generate_css(colors, font):
       css = f"""
       .fess-search {{
           background-color: {colors['background']};
           color: {colors['text']};
           font-family: {font};
       }}
       """
       return css
   ```

3. **JSON Configuration**:
   ```python
   def generate_config(form_data):
       config = {
           'fessUrl': form_data.get('fessUrl'),
           'colors': generate_colors(form_data),
           'font': form_data.get('font', 'sans-serif')
       }
       return json.dumps(config)
   ```

---

## 7. Configuration Management

### 7.1 Flask Configuration

**File**: `app/app.py`

```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'instance/uploads')
    GENERATES_FOLDER = os.path.join(BASE_DIR, 'instance/generates')
    DOCS_FOLDER = os.path.join(BASE_DIR, 'app/docs')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload size
```

### 7.2 Vue.js Configuration

**File**: `fss/vue.config.js`

```javascript
module.exports = {
  filenameHashing: false,  // Disable hash in output filename

  configureWebpack: {
    output: {
      filename: process.env.FSS_OUTPUT_NAME || 'fess-ss.js'
    },
    optimization: {
      splitChunks: false  // Bundle everything in one file
    },
    resolve: {
      fallback: {
        querystring: require.resolve('querystring-es3')
      }
    }
  }
}
```

**Environment Variables**:
- `FSS_OUTPUT_NAME`: Custom output filename (default: `fess-ss.js`)
- `FSS_CONFIG_PATH`: Path to JSON configuration file
- `FSS_CSS_PATH`: Path to custom CSS file

### 7.3 ESLint Configuration

**File**: `fss/.eslintrc.json`

```json
{
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "parser": "@babel/eslint-parser"
  },
  "ignorePatterns": ["src/openapi/**"],
  "rules": {
    "no-console": "off"
  }
}
```

---

## 8. Testing Requirements

### 8.1 Test Suite

#### Integration Tests (test_status.py)

**Purpose**: Verify HTTP endpoints return correct status codes

**Test Cases**:
```python
def test_home():
    assert GET('/').status_code == 200

def test_home_ja():
    assert GET('/ja/').status_code == 200

def test_manual():
    assert GET('/docs/manual').status_code == 200

def test_manual_ja():
    assert GET('/ja/docs/manual').status_code == 200

def test_generator():
    assert GET('/generator').status_code == 200
```

#### Functional Tests (test_FSS_generator.py)

**Test Case 1: Wizard Generation**
```python
def test_wizard():
    # Submit generator form with random colors
    form_data = {
        'fessUrl': 'https://search.example.com',
        'bgColor': random_color(),
        'textColor': random_color(),
        'linkColor': random_color(),
        'borderColor': random_color(),
        'font': 'sans-serif'
    }

    response = POST('/generator', data=form_data)

    # Should redirect to demo page
    assert response.status_code == 302
    assert '/demo/' in response.location

    # Extract hash from redirect URL
    hash_id = extract_hash(response.location)

    # Wait for build to complete
    assert check_webpack(hash_id, timeout=10)

    # Verify JS file exists
    assert os.path.exists(f'instance/generates/fess-ss-{hash_id}.min.js')
```

**Test Case 2: CSS Upload**
```python
def test_upload():
    # Create custom CSS file
    css_content = """
    .fess-search {
        background-color: #ff0000;
        font-size: 18px;
    }
    """

    # Upload CSS file
    response = POST('/generator', data={
        'fessUrl': 'https://search.example.com',
        'file': ('custom.css', css_content, 'text/css')
    })

    assert response.status_code == 302
    hash_id = extract_hash(response.location)

    # Verify uploaded CSS file
    assert os.path.exists(f'instance/uploads/{hash_id}.css')

    # Wait for build
    assert check_webpack(hash_id, timeout=10)
```

### 8.2 Test Execution

#### Local Testing
```bash
pytest -v ./tests
```

#### Docker Testing
```bash
docker build -t fss .
docker run -d -p 5000:5000 fss
pytest -v ./tests
```

#### CI/CD Testing (Travis CI)
```yaml
script:
  - docker ps | grep -q fss  # Verify container is running
  - pytest -v ./tests         # Run test suite
```

---

## 9. Security Considerations

### 9.1 Input Validation

#### Form Input Validation
- **Fess URL**:
  - Must be valid HTTP/HTTPS URL
  - Prevent SSRF attacks by validating domain

- **Color Values**:
  - Must match hex color pattern: `#[0-9A-Fa-f]{6}`

- **Font Selection**:
  - Whitelist allowed fonts (sans-serif, serif, monospace)

#### File Upload Security
- **CSS File Validation**:
  - Maximum file size: 16 MB
  - Content-Type validation: `text/css`
  - CSS syntax validation using cssutils
  - Sanitize file contents to prevent XSS

- **File Storage**:
  - Store uploads in isolated directory: `instance/uploads/`
  - Use hash-based filenames to prevent path traversal
  - Set restrictive file permissions (0644)

### 9.2 XSS Prevention

- **Template Rendering**:
  - Use Jinja2 auto-escaping for HTML output
  - Escape user-provided content in demo pages

- **JavaScript Embedding**:
  - Sanitize configuration JSON before embedding
  - Use Content Security Policy headers

### 9.3 CSRF Protection

- Enable Flask-WTF CSRF protection for forms
- Include CSRF tokens in form submissions

### 9.4 Dependency Security

- Regularly update dependencies to patch vulnerabilities
- Use `pip-audit` to scan for known vulnerabilities
- Use `npm audit` for Node.js dependencies

---

## 10. Performance Requirements

### 10.1 Response Time

| Endpoint | Target Response Time |
|----------|---------------------|
| GET / | < 200ms |
| GET /generator | < 200ms |
| POST /generator | < 500ms (excluding build) |
| GET /demo/{fname} | < 200ms |
| GET /api/check_js/{fname} | < 100ms |

### 10.2 Build Performance

- **Webpack Build Time**: < 30 seconds per configuration
- **Concurrent Builds**: Support 2-4 concurrent builds (configurable)
- **Build Queue**: FIFO processing with semaphore-based throttling

### 10.3 Scalability

#### Horizontal Scaling
- Stateless application design (no session storage)
- Shared file storage for generated files (NFS, S3)
- Load balancer distribution

#### Vertical Scaling
- Gunicorn workers: 2-4x CPU cores
- Thread pool: 8-16 threads per worker
- Webpack limit: 25-50% of CPU cores

### 10.4 Caching Strategy

- **Static Assets**: Browser caching with cache-busting hashes
- **Generated JS Files**: Long-term caching (1 year)
- **Documentation Pages**: Server-side caching (optional)

### 10.5 Monitoring

#### Application Metrics
- Request rate per endpoint
- Average response time
- Error rate (4xx, 5xx)
- Active build processes
- Build queue depth

#### System Metrics
- CPU usage
- Memory usage
- Disk I/O (for builds)
- Network I/O

---

## Appendix A: File Formats

### A.1 Configuration JSON Format

```json
{
  "fessUrl": "https://search.example.com",
  "fessContextPath": "/",
  "fessSearchPagePath": "/search",
  "fessThumbnailPath": "/thumbnail",
  "colors": {
    "background": "#ffffff",
    "text": "#333333",
    "link": "#0066cc",
    "linkHover": "#0052a3",
    "border": "#cccccc",
    "headerBackground": "#f5f5f5",
    "footerBackground": "#f5f5f5"
  },
  "font": "sans-serif",
  "fontSize": "14px",
  "searchOptions": {
    "pageSize": 20,
    "suggestionCount": 5,
    "enableFavorites": true,
    "enableRelatedQueries": true,
    "enableThumbnails": true
  }
}
```

### A.2 Custom CSS Format

```css
/* Override search container styles */
.fess-search {
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

/* Customize search form */
.fess-search-form {
  border: 1px solid #cccccc;
  border-radius: 4px;
}

/* Customize search results */
.fess-result-item {
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
}

.fess-result-title {
  color: #0066cc;
  font-size: 18px;
  font-weight: bold;
}

.fess-result-content {
  color: #333333;
  line-height: 1.5;
}
```

---

## Appendix B: Browser Support

### Supported Browsers

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Polyfills

- **core-js**: ES6+ feature polyfills
- **querystring-es3**: Node.js querystring polyfill
- **Babel**: ES6 to ES5 transpilation

---

## Appendix C: License

Fess Site Search is licensed under the Apache License 2.0.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-08
**Author**: CodeLibs Project
