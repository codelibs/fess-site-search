
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
1. Rename the above file to fess-ss.js and upload it to your web site.
1. Create HTML file(ex. result.html) to display a search result.
1. Put the following HTML tags at a location to display a search box/result. (Replace a value of fess-url with your Fess server)
1. To display a search result from other pages, put a search form to navigate to result.html?fss.query=WORDS.

```html
<!-- Load FSS JS -->
<script src="fess-ss.js"></script>

<!-- Set up FSS components -->
<div class="fess-site-search">
  <fess-search-form
    language="ja"
  ></fess-search-form>
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

## Layout Of Search Result

You can change the layout of your search result by selecting from tags.
The following 3 layouts are available.

### Standard(Search Form/Result)
```html
<div class="fess-site-search">
  <fess-search-form
  ></fess-search-form>
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

### Search Form Only
```html
<div class="fess-site-search">
  <fess-search-form
    result-page="Path of result page."
  ></fess-search-form>
</div>
```

### Search Result Only
```html
<div class="fess-site-search">
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

## Options

### Options for fess-search-form

#### Set Language
```html
language="en"
```

#### Use Auto-Complete
```html
:enable-suggest="true"
:suggest-url="https://search.n2sm.co.jp"
```

#### Move To Search Result Page
```html
result-page="result.html"
```

### Options for fess-search-result

#### Display Label Search Conditions
```html
:enable-label="true"
```

#### Display Label Search Conditions in Tab Style
```html
:enable-label-tab="true"
```

#### Display Related Query/Content
```html
:enable-related="true"
```

#### Hide Sort Condition
```html
:enable-order="false"
```

#### Hide Thumbnail View
```html
:enable-thumbnail="false"
```

#### Change The Number of Reuslts
```html
:page-size="20"
```

#### Open Document In New Tab
```html
link-target="_blank"
```

#### Set Query Language
```html
language="ja"
```

## Use Google Analytics

To enable Site Search Tracking on Google Analytics, see [Set up Site Search](https://support.google.com/analytics/answer/1012264).
Query Parameter is `fss.query`.
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
