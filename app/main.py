import subprocess, os, hashlib, random, traceback
from flask import Flask, request, redirect, url_for
from flask import render_template, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'uploads')
app.config['DOWNLOAD_FOLDER'] = os.path.join(app.instance_path, 'generates')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    return upload()
  return render_template('index.html')

def upload():
  fess_version = request.form.get('fess-version')

  if 'file' not in request.files:
    return render_template('index.html')
  file = request.files['file']
  if file.filename == '':
    return render_template('index.html')

  if file and is_css(file.filename):
    base = secure_filename(file.filename)[:-4]
    hash_str = rand_hash()
    basename = "{}_{}".format(base, hash_str)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], basename + ".css"))
    print("Upload: {}.css".format(basename))
    return generate(fess_version, basename)

  return render_template('index.html')

def generate(fess_version, basename):
  my_env = os.environ.copy()
  jsfile = generate_js_name(fess_version, basename)

  my_env["INPUT_CSS_PATH"] = "{}/{}.css".format(app.config['UPLOAD_FOLDER'], basename)
  my_env["OUTPUT_JS_FILENAME"] = jsfile

  print("Version: {}".format(fess_version))
  print("generate_js: {} -> {}".format(my_env["INPUT_CSS_PATH"], my_env["OUTPUT_JS_FILENAME"]))

  try:
    (cwd, cmd) = get_command(fess_version)
    print('Command: {}'.format(cmd))
    proc = subprocess.Popen(cmd, env=my_env, cwd=cwd)
    outs, errs = proc.communicate()
    print("Success to generate {}".format(jsfile))
    return send_from_directory(directory=app.config['DOWNLOAD_FOLDER'], filename=jsfile, as_attachment=True)
  except:
    print("Fail to generate {}".format(jsfile))
    traceback.print_exc()
    return redirect(url_for('index'))

# Utils
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

def generate_js_name(version, base):
  vs = version.replace('.', '_')
  return 'fess-ss-{}-{}.min.js'.format(vs, base)
