# fss (Fess Site Search)

Fess Site Search JavaScript widget generator built with Vue 3 and TypeScript.

## Technology Stack

- **Language**: TypeScript 5.9+
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 6
- **Styling**: Bootstrap 5 + SCSS
- **Type Checking**: vue-tsc
- **Linting**: ESLint + Prettier

## Project setup
```
npm install
```

### Development server with hot-reload
```
npm run dev
```

### Type check
```
npm run type-check
```

### Build for production
```
npm run build
```

### Preview production build
```
npm run preview
```

### Lint files
```
npm run lint
npm run lint:fix  # Auto-fix lint errors
```

### Format files
```
npm run format
npm run format:check  # Check formatting without changes
```

### Customize configuration
See [Vite Configuration Reference](https://vite.dev/config/).

### Generate OpenAPI client

Generate TypeScript API client from Fess OpenAPI specification.

```bash
cd openapi
./generate.sh
```

To generate for a specific Fess version:

```bash
./generate.sh -t 14.18.0
```

This script clones the Fess repository, extracts the OpenAPI specification, and generates TypeScript-Axios client code into `src/openapi/main/`.

## TypeScript Migration

This project has been fully migrated to TypeScript. For detailed information:

- **Migration Plan**: See `claude_progress/typescript_migration_plan.md`
- **Developer Guide**: See `claude_progress/typescript_migration_guide.md`
- **Phase 7 Report**: See `claude_progress/typescript_migration_phase7_report.md`

### Key Features
- ✅ 100% TypeScript (hand-written code)
- ✅ Strict mode enabled
- ✅ Zero `any` type usage (excluding auto-generated OpenAPI code)
- ✅ Full type safety with comprehensive type definitions

## Usage

### Getting started

Load `fess-ss.js` in html.

```html
<script defer src="/fess-ss.js"></script>
```

Embed the following code in html body.

```html
<div class="fess-site-search">
  <fess-search-form
    language="ja"
  ></fess-search-form>
  <fess-search-result
    fess-url="https://search.n2sm.co.jp/"
    language="ja"
    link-target="_blank"
    :page-size="5"
    :enable-label="true"
    :enable-thumbnail="true"
  ></fess-search-result>
</div>
```

### fess-search-form

Component for search form.

#### Props

|  Prop        |  Description  |
| ---- | ---- |
|  language    | Language setting.   |
|  result-page  | Action attr of search form  |


### fess-search-result

Component for search result.

#### Props

|  Prop        |  Description  |
| ---- | ---- |
|  fess-url  | Url of fess  |
|  language  | Language setting |
|  link-target |  Name of a frame where a document is to be opened  |
|  page-size |  Number of search result documents per page.  |
|  enable-label | Show label option   |
|  enable-label-tab | Show label tab   |
|  enable-thumbnail | Show thumbnail   |
|  enable-related | Show related query   |

