# Contributing to Fess Site Search

Thank you for your interest in contributing to Fess Site Search! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- uv (Python package manager)
- Git

### Setting Up Development Environment

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fess-site-search.git
   cd fess-site-search
   ```

2. **Install uv**:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. **Run the installation script**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

4. **Verify installation**:
   ```bash
   uv run pytest -v
   ```

## Development Workflow

### Creating a Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Making Changes

1. **Make your changes** in the appropriate files

2. **Test your changes**:
   ```bash
   # Run all tests
   uv run pytest -v

   # Run specific test file
   uv run pytest tests/test_status.py -v

   # Run with coverage
   uv run pytest --cov=app --cov-report=html
   ```

3. **Lint your code**:
   ```bash
   # Python
   uv run ruff check app/ tests/
   uv run ruff format app/ tests/

   # JavaScript
   cd fss/
   npm run lint:fix
   ```

4. **Build and test locally**:
   ```bash
   # Test Flask app
   export FLASK_APP=app/__init__.py
   uv run flask run

   # Test Docker build
   docker build -t fss-test .
   docker run -d -p 5000:5000 fss-test
   ```

### Committing Changes

Follow conventional commit format:

```bash
git commit -m "type(scope): description"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat(generator): add support for custom fonts"
git commit -m "fix(build): resolve webpack memory leak"
git commit -m "docs(readme): update installation instructions"
```

## Coding Standards

### Python Code Style

We use **Ruff** for linting and formatting:

- Maximum line length: 160 characters
- Follow PEP 8 guidelines
- Use type hints where appropriate
- Write docstrings for public functions and classes

Example:
```python
def generate_config(form_data: dict) -> str:
    """Generate configuration JSON from form data.

    Args:
        form_data: Dictionary containing form field values

    Returns:
        JSON string with configuration
    """
    config = {
        'fessUrl': form_data.get('fessUrl'),
        'colors': generate_colors(form_data)
    }
    return json.dumps(config)
```

### JavaScript/Vue.js Code Style

We use **ESLint** with Vue 3 rules:

- Use Vue 3 Composition API where appropriate
- Follow Vue.js style guide
- Use meaningful component and variable names
- Add comments for complex logic

Example:
```javascript
// Good
const searchResults = ref([])
const isLoading = ref(false)

// Bad
const data = ref([])
const flag = ref(false)
```

### File Organization

- **Python files**: Use snake_case (e.g., `build_manager.py`)
- **Vue components**: Use PascalCase (e.g., `SearchForm.vue`)
- **JavaScript files**: Use camelCase (e.g., `apiClient.js`)

## Testing

### Writing Tests

#### Python Tests

Use pytest for Python tests:

```python
def test_wizard_generation():
    """Test wizard-based widget generation."""
    form_data = {
        'fessUrl': 'https://search.example.com',
        'bgColor': '#ffffff',
        'textColor': '#333333'
    }

    response = client.post('/generator', data=form_data)

    assert response.status_code == 302
    assert '/demo/' in response.location
```

#### JavaScript Tests

Add tests in the appropriate test directory.

### Running Tests

```bash
# Run all Python tests
uv run pytest -v

# Run specific test file
uv run pytest tests/test_status.py

# Run with coverage
uv run pytest --cov=app --cov-report=html

# Run JavaScript linter
cd fss/
npm run lint
```

### Test Coverage

- Aim for at least 80% code coverage
- Cover edge cases and error conditions
- Test both success and failure paths

## Pull Request Process

### Before Submitting

1. **Update documentation** if you've changed functionality
2. **Run all tests** and ensure they pass
3. **Run linters** and fix any issues
4. **Update CHANGELOG** if applicable
5. **Rebase on latest main branch**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### Submitting Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference any related issues (e.g., "Fixes #123")
   - Screenshots if UI changes are involved

3. **Pull Request Template**:
   ```markdown
   ## Description
   Brief description of the changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe the tests you ran

   ## Checklist
   - [ ] Tests pass locally
   - [ ] Code follows project style guidelines
   - [ ] Documentation updated
   - [ ] No new warnings introduced
   ```

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, a maintainer will merge your PR

## Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test with latest version** to ensure bug still exists
3. **Gather relevant information**:
   - OS and version
   - Python version
   - Node.js version
   - Browser (if frontend issue)

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Ubuntu 22.04]
- Python: [e.g., 3.11.0]
- Node.js: [e.g., 18.16.0]
- Browser: [e.g., Chrome 120]

## Additional Context
Any other relevant information
```

## Suggesting Enhancements

### Enhancement Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why this feature would be useful

## Proposed Solution
How you think this should be implemented

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Any other relevant information
```

## Development Tips

### Useful Commands

```bash
# Start development server with auto-reload
export FLASK_ENV=development
uv run flask run

# Build frontend with watch mode
cd fss/
npm run serve

# Run tests in watch mode
uv run pytest-watch

# Format all code
uv run ruff format .
cd fss/ && npm run lint:fix
```

### Debugging

#### Python Debugging

Use Python debugger (pdb):
```python
import pdb; pdb.set_trace()
```

Or use IDE debugging features with breakpoints.

#### JavaScript Debugging

Use browser DevTools or add:
```javascript
debugger;
```

### Performance Tips

- Profile slow operations
- Use build manager semaphore effectively
- Optimize webpack builds
- Cache generated files appropriately

## Questions?

If you have questions about contributing:

- Check existing [Issues](https://github.com/codelibs/fess-site-search/issues)
- Join discussions in Pull Requests
- Contact maintainers: support@n2sm.net

Thank you for contributing to Fess Site Search! 🎉
