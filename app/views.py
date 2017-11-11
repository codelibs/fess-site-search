import os
from flask import g
from flask import request, redirect, url_for, render_template
from flask import jsonify, abort, make_response
from markdown import markdown

from .app import app, babel
from .backend import upload, wizard

@app.before_request
@babel.localeselector
def detect_user_language():
  g.language = request.accept_languages.best_match(['en', 'ja'])

# Top Page
@app.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    if 'file' in request.files:
      return upload(request.form, request.files['file'])
    else:
      return wizard(request.form)

  return render_template('index.html')

# Demo Page
@app.route('/demo/<fname>')
def demo(fname):
  my_dic = {}
  my_dic['js_path'] = '/generates/fess-ss-{}.min.js'.format(fname)
  my_dic['js_file'] = 'fess-ss-{}.min.js'.format(fname)
  my_dic['search_src'] = '/search/{}?q=test'.format(fname)
  print(my_dic['search_src'])
  return render_template('demo.html', message=my_dic)

# Search Result for Preview
@app.route('/search/')
def preview():
  my_dic = {}
  my_dic['js_path'] = '/static/fss/11.4/fess-ss.min.js'
  my_dic['page_path'] = '/search/'
  return render_template('search.html', message=my_dic)

# Search Result Frame in Demo page
@app.route('/search/<fname>')
def search(fname):
  my_dic = {}
  my_dic['js_path'] = '/generates/fess-ss-{}.min.js'.format(fname)
  my_dic['page_path'] = '/search/{}'.format(fname)
  return render_template('search.html', message=my_dic)

# Search Results in Frame
@app.route('/docs/manual')
def manual():
  path = os.path.join(app.config['DOCS_FOLDER'], 'user-manual.' + g.language + '.md')
  md_file = open(path, mode='r', encoding='utf-8')
  md_str = md_file.read()
  md_file.close()
  extensions = ['gfm']
  html = markdown(md_str, extensions=extensions)

  my_dic = {}
  my_dic['markdown_content'] = html
  return render_template('manual.html', message=my_dic)

###########
# API
###########
# Check if 'fess-ss-<fname>.min.js' exists
@app.route('/api/check_js/<fname>', methods=['GET'])
def check_js(fname):
  jsfile = 'fess-ss-{}.min.js'.format(fname)
  path = os.path.join(app.config['DOWNLOAD_FOLDER'], jsfile)
  if os.path.exists(path):
    return make_response(jsonify({'result': True}))
  return make_response(jsonify({'result': False}))
