import subprocess, os, hashlib, random, traceback
from flask import Flask, request, redirect, url_for, flash
from flask import render_template, send_from_directory
from werkzeug.utils import secure_filename

WEBPACK_CMD = 'node_modules/.bin/webpack --config webpack.config.js'

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
  if 'file' not in request.files:
    flash('No file part')
    return redirect(request.url)
  file = request.files['file']
  if file.filename == '':
    flash('No selected file')
    return redirect(request.url)

  if file and is_css(file.filename):
    base = secure_filename(file.filename)[:-4]
    hash_str = rand_hash()
    basename = "{}-{}".format(base, hash_str)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], basename + ".css"))
    print("Upload: {}.css".format(basename))
    return generate(basename)

  return render_template('index.html')

def generate(basename):
  my_env = os.environ.copy()
  jsfile = "fess-ss-{}.min.js".format(basename)

  my_env["INPUT_CSS_PATH"] = "{}/{}.css".format(app.config['UPLOAD_FOLDER'], basename)
  my_env["OUTPUT_JS_FILENAME"] = jsfile

  print("generate_js: {} -> {}".format(my_env["INPUT_CSS_PATH"], my_env["OUTPUT_JS_FILENAME"]))

  try:
    proc = subprocess.Popen(WEBPACK_CMD.split(), env=my_env, cwd='webpack')
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
