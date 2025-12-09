import os

import cssutils

from .app import app
from .custom_config_rules import add_rule, get_config_rules


def generate_config(form, fname):
    json_filename = os.path.join(app.config["UPLOAD_FOLDER"], fname + ".json")
    css_filename = os.path.join(app.config["UPLOAD_FOLDER"], fname + ".css")
    (json, css) = form2files(form)
    with open(json_filename, "w") as jf, open(css_filename, "w") as cf:
        jf.write(json)
        cf.write(css.cssText.decode("utf-8"))
        return True
    return False


def form2files(form):
    json = ""
    css = cssutils.css.CSSStyleSheet()
    config_rules = get_config_rules()

    for rule in config_rules:
        (json, css) = add_rule(json, css, form, rule)

    return ("{" + json + "}", css)
