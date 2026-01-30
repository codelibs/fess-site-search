# fss

## Project setup
```
npm install
```

### Development server with hot-reload
```
npm run dev
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
```

### Format files
```
npm run format
```

### Customize configuration
See [Vite Configuration Reference](https://vite.dev/config/).

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

