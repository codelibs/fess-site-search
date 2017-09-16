import os
import hashlib
import random
from flask import Flask, request, redirect, url_for, flash
from flask import send_from_directory
from flask import render_template
from werkzeug.utils import secure_filename
from werkzeug import SharedDataMiddleware

ALLOWED_EXTENSIONS = set(['css'])
UPLOAD_FOLDER = 'out/uploads'
DOWNLOAD_FOLDER = 'out/generates'

app = Flask(__name__, static_folder=DOWNLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

app.add_url_rule('/uploads/<filename>', 'uploaded_file', build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})

def rand_hash():
  hash = hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()
  return hash[:10]

def allowed_file(filename):
  if '.' in filename:
    return filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
  return False

@app.route('/', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    if 'file' not in request.files:
      flash('No file part')
      return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
      flash('No selected file')
      return redirect(request.url)

    if file and allowed_file(file.filename):
      base = secure_filename(file.filename)[:-4]
      hash_str = rand_hash()
      filename = "{}-{}.css".format(base, hash_str)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return redirect(url_for('generate_js', hash_str=hash_str))
  return render_template('index.html')

@app.route('/uploads/<hash_str>')
def generate_js(hash_str):
  return hash_str
