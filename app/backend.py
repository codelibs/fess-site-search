import hashlib
import os
import random

from flask import flash, redirect, url_for
from werkzeug.utils import secure_filename

from .app import app
from .build_manager import BuildManager
from .generate_config import generate_config


def upload(form, file):
    if file.filename == "":
        return redirect(url_for('generator'))

    if file and is_css(file.filename):
        base = secure_filename(file.filename)[:-4]
        hash_str = rand_hash()
        fname = f'{base}_{hash_str}'
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], fname + '.css'))
        print(f'Upload: {fname}.css')
        return run_build(fname)

    return redirect(url_for('generator'))


def wizard(form):
    hash_str = form2hash(form)
    fname = f'wizard_{hash_str}'

    if js_exists(fname):
        return redirect(url_for('demo', fname=fname))
    elif generate_config(form, fname):
        return run_build(fname)
    else:
        return redirect(url_for('generator'))


def run_build(fname):
    build_manager = BuildManager()
    if build_manager.run(app.config["DOWNLOAD_FOLDER"], app.config["UPLOAD_FOLDER"], app.instance_path, fname):
        return redirect(url_for('demo', fname=fname))
    else:
        flash("Please try again")
        return redirect(url_for('generator'))


def rand_hash():
    hashstr = hashlib.sha256(str(random.getrandbits(256)).encode("utf-8")).hexdigest()
    return hashstr[:10]


def form2hash(form):
    return hashlib.sha256(str(form).encode()).hexdigest()[:10]


def is_css(filename):
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        return ext == 'css'
    return False


def is_empty_form(form):
    for (_k, v) in form.items():
        if v:
            return False
    return True


def js_exists(fname):
    jsfile = f'fess-ss-{fname}.min.js'
    path = os.path.join(app.config["DOWNLOAD_FOLDER"], jsfile)
    return os.path.exists(path)
