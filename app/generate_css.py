import os
import cssutils
from .app import app
from .custom_css_rules import get_CSS_rules, add_rule


def generate_css(form, fname):
    filename = os.path.join(app.config['UPLOAD_FOLDER'], fname + '.css')
    css = form2css(form)
    with open(filename, 'w') as f:
        f.write(css.cssText.decode('utf-8'))
        return True
    return False


def form2css(form):
    css = cssutils.css.CSSStyleSheet()
    css_rules = get_CSS_rules()

    for rule in css_rules:
        css = add_rule(css, form, rule)

    return css
