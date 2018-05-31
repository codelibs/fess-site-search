
## What is Fess Site Search?

Fess Site Search (FSS) provides a search feature that integrates [Enterprise Search Server Fess](http://fess.codelibs.org/) into an existing website.
Using tags provided by FSS and JavaScript files, you can display a search box and search result table on your website.
The installation is very easy and you can smoothly migrate from Google Site Search, Google Custom Search or the like.

## Download

To click Generate button on [FSS JS Generator](/generator), JavaScript file for FSS is generated.
After checking a preview search result, you can download it to click Download JS button.

## Installation

FSS is available by simple installation steps.
FSS requires Fess server as Search server before this installation.

### Case: Your site does not have a search page

1. Download JavaScript file from FSS JS Genereator.
1. Rename the above file to fess-ss.min.js and upload it to your web site.
1. Create HTML file(ex. result.html) to display a search result.
1. Put the following HTML tags at a location to display a search box/result. (Replace a value of fess-url with your Fess server)
1. To display a search result from other pages, put a search form to navigate to result.html?q=WORDS.

```html
<script>
  (function() {
    var fess = document.createElement('script');
    fess.type = 'text/javascript';
    fess.async = true;
    // fess.src is URL for FSS JS
    fess.src = 'fess-ss.min.js';
    fess.charset = 'utf-8';
    fess.setAttribute('id', 'fess-ss');
    // fess-url is URL for Fess Server
    fess.setAttribute('fess-url', 'http://search.n2sm.co.jp/json');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fess, s);
  })();
</script>

<fess:search></fess:search>
```

### Case: Use FSS as Google Site Search Alternative

1. Put the following HTML tags at a location to display a search box/result. (Replace a value of fess-url with your Fess server)
1. To display a search result from other pages, put a search form to navigate to result.html?q=WORDS.

```html
<script>
  (function() {
    var fess = document.createElement('script');
    fess.type = 'text/javascript';
    fess.async = true;
    // fess.src is URL for FSS JS
    fess.src = 'fess-ss.min.js';
    fess.charset = 'utf-8';
    fess.setAttribute('id', 'fess-ss');
    // fess-url is URL for Fess Server
    fess.setAttribute('fess-url', 'http://search.n2sm.co.jp/json');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fess, s);
  })();
</script>

<fess:search></fess:search>
```

## Layout Of Search Result

You can change the layout of your search result by selecting from `fess` tags.
The following 3 layouts are available.

### Standard(Search Form/Result)
```html
<fess:search></fess:search>
```

### Search Form Only
```html
<fess:search-form-only></fess:search-form-only>
```

### Search Result Only
```html
<fess:search-result-only></fess:search-result-only>
```

## Options

### Display Label Search Conditions
```javascript
fess.setAttribute('enable-labels', 'true');
```

### Use Overlay Layout
```javascript
fess.setAttribute('popup-result', 'true');
```

### Display Related Query/Content
```javascript
fess.setAttribute('enable-related', 'true');
```

### Use Auto-Complete
```javascript
fess.setAttribute('enable-suggest', 'true');
```

### Hide Sort Condition
```javascript
fess.setAttribute('enable-order', 'false');
```

### Hide Thumbnail View
```javascript
fess.setAttribute('enable-thumbnail', 'false');
```

### Move To Search Result Page
If you use `fess:search-form-only` tag, using the following setting, you can move to a search result page.
```javascript
fess.setAttribute('fess-search-page-path', 'result.html');
```

### Change The Number of Reuslts
```javascript
fess.setAttribute('page-size', '20');
```

### Open Document In New Tab
```javascript
fess.setAttribute('link-target', '_blank');
```

### Set Query Language
```javascript
fess.setAttribute('language', 'en');
```

## Use Google Analytics

To enable Site Search Tracking on Google Analytics, see [Set up Site Search](https://support.google.com/analytics/answer/1012264).
Query Parameter is `q`.
After that, in order to track search queries on FSS, put the following HTML tag before FSS tags.
```javascript
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXXXX-X', 'auto'); // PUT YOUR UA-XXXXXXX-X
</script>
```

## Commercial Support

If you need more supports, please see [Commercial Support](http://www.n2sm.net/en/support/fess_support.html).
