import os
from flask import Flask, Blueprint
from flask.ext.babel import Babel


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'uploads')
app.config['DOWNLOAD_FOLDER'] = os.path.join(app.instance_path, 'generates')
app.config['DOCS_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Add static folder cf. https://stackoverflow.com/a/9516694
gen_bp = Blueprint('generates', __name__, static_url_path='/generates', static_folder=os.path.join(app.instance_path, 'generates'))
app.register_blueprint(gen_bp)

babel = Babel(app)
