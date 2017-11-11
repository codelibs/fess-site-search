import os
import hashlib
import random
from flask import redirect, url_for, flash
from flask import render_template
from werkzeug.utils import secure_filename
from .app import app
from .generate_css import generate_css
from .webpack_manager import WebpackManager

DEFAULT_VERSION = '11.4'


def upload(form, file):
    version = form.get('fess-version', DEFAULT_VERSION)
    print(form)

    if file.filename == '':
        return render_template('index.html')

    if file and is_css(file.filename):
        base = secure_filename(file.filename)[:-4]
        hash_str = rand_hash()
        fname = '{}_{}_{}'.format(base, hash_str, version.replace('.', '_'))
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], fname + '.css'))
        print('Upload: {}.css'.format(fname))
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
    wp_manager = WebpackManager()
    if wp_manager.run(app.config['UPLOAD_FOLDER'], app.instance_path, fname, version):
        return redirect(url_for('demo', fname=fname))
    else:
        flash('Please try again')
        return redirect(url_for('index'))


def rand_hash():
    hashstr = hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()
    return hashstr[:10]


def is_css(filename):
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        return ext == 'css'
    return False
