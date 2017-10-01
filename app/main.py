import subprocess, os, hashlib, random, traceback
from flask import Flask, request, redirect, url_for
from flask import render_template, send_from_directory
from flask import jsonify, abort, make_response
from werkzeug.utils import secure_filename
from flask import Blueprint

###########
# Config
###########
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'uploads')
app.config['DOWNLOAD_FOLDER'] = os.path.join(app.instance_path, 'generates')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Add static folder cf. https://stackoverflow.com/a/9516694
gen_bp = Blueprint('generates', __name__, static_url_path='/generates', static_folder=os.path.join(app.instance_path, 'generates'))
app.register_blueprint(gen_bp)


###########
# Routing
###########

# Top Page
@app.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    return upload()
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

# Search Results in Frame
@app.route('/search/<fname>')
def search(fname):
  my_dic = {}
  my_dic['js_path'] = '/generates/fess-ss-{}.min.js'.format(fname)
  my_dic['page_path'] = '/search/{}'.format(fname)
  return render_template('search.html', message=my_dic)

###########
# API
###########
# Check if 'fess-ss-<fname>.min.js' is already generated
@app.route('/api/check_js/<fname>', methods=['GET'])
def check_js(fname):
  jsfile = 'fess-ss-{}.min.js'.format(fname)
  path = os.path.join(app.config['DOWNLOAD_FOLDER'], jsfile)
  if os.path.exists(path):
    return make_response(jsonify({'result': True}))
  return make_response(jsonify({'result': False}))

###########
# Back-end Process
###########
def upload():
  version = request.form.get('fess-version')

  if 'file' not in request.files:
    return render_template('index.html')
  file = request.files['file']
  if file.filename == '':
    return render_template('index.html')

  if file and is_css(file.filename):
    base = secure_filename(file.filename)[:-4]
    hash_str = rand_hash()
    fname = "{}_{}_{}".format(base, hash_str, version.replace('.', '_'))
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], fname + ".css"))
    print("Upload: {}.css".format(fname))
    return generate(fname, version)

  return render_template('index.html')

def generate(fname, version):
  my_env = os.environ.copy()
  jsfile = 'fess-ss-{}.min.js'.format(fname)

  my_env["INPUT_CSS_PATH"] = "{}/{}.css".format(app.config['UPLOAD_FOLDER'],fname)
  my_env["OUTPUT_JS_FILENAME"] = jsfile

  print("generate_js: {} -> {}".format(my_env["INPUT_CSS_PATH"], my_env["OUTPUT_JS_FILENAME"]))

  try:
    (cwd, cmd) = get_command(version)
    print('Command: {}'.format(cmd))
    proc = subprocess.Popen(cmd, env=my_env, cwd=cwd)
    print('Redirect > /demo/{}'.format(fname))
    return redirect(url_for('demo', fname=fname))
  except:
    print("Fail to generate {}".format(jsfile))
    traceback.print_exc()
    return redirect(url_for('index'))

###########
# Utilities
###########
def rand_hash():
  hash = hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()
  return hash[:10]

def is_css(filename):
  if '.' in filename:
    ext = filename.rsplit('.', 1)[1].lower()
    return ext == 'css'
  return False

def get_command(version):
  cwd = os.path.join(app.instance_path, '../fss/{}'.format(version))
  cmd = '{0}/node_modules/.bin/webpack --config {0}/webpack.config.js'.format(cwd)
  return (cwd, cmd.split())
