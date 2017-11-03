# Fess Site Search [![Build Status](https://travis-ci.org/codelibs/fess-site-search.svg?branch=master)](https://travis-ci.org/codelibs/fess-site-search)

Fess Site Search(FSS) provides JS file to deploy Search features on your web site.
FSS JS is a JavaScript file.
Putting it to your web site, search results provided by Fess are available.
[FSS Generator](https://fss-generator.codelibs.org/) provides FSS JS file.

## FSS Generator

See [FSS Generator](https://fss-generator.codelibs.org/docs/manual).

## Development

### Docker
```bash
$ docker build -t fss .
$ docker run -d -p 5000:5000 fss
```

### Run locally

```bash
$ ./install.sh
$ export FLASK_APP=app/__init__.py
$ flask run
```
