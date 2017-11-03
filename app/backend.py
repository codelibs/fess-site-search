import subprocess, os, hashlib, random, traceback
from flask import redirect, url_for
from flask import render_template
from werkzeug.utils import secure_filename
from .app import app
from .generate_css import generate_css

DEFAULT_VERSION = '11.4'

def upload(form, file):
  version = form.get('fess-version', DEFAULT_VERSION)
  print(form)

  if file.filename == '':
    return render_template('index.html')

  if file and is_css(file.filename):
    base = secure_filename(file.filename)[:-4]
    hash_str = rand_hash()
    fname = "{}_{}_{}".format(base, hash_str, version.replace('.', '_'))
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], fname + ".css"))
    print("Upload: {}.css".format(fname))
    return run_webpack(fname, version)

  return render_template('index.html')

def wizard(form):
  print('wizard!!')
  version = form.get('fess-version', DEFAULT_VERSION)
  fname = 'wizard_{}_{}'.format(rand_hash(), version.replace('.', '_'))
  if generate_css(form, fname):
    return run_webpack(fname, version)
  else:
    return render_template('index.html')

def run_webpack(fname, version):
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
