import os
import cssutils
from .app import app

def generate_css(form, fname):
  filename = os.path.join(app.config['UPLOAD_FOLDER'], fname + ".css")
  css = form2css(form)
  with open(filename, 'w') as f:
    f.write(css.cssText.decode('utf-8'))
    return True
  return False

def form2css(form):
  css = cssutils.css.CSSStyleSheet()

  # Add rules from the form
  if form.get('bg-color'):
    color = form.get('bg-color')
    rule = '''.fessWrapper {{
      background-color: {};
    }}'''.format(color)
    add_rule(css, rule)

  if form.get('button-color'):
    color = form.get('button-color')
    rule = '''.fessWrapper #searchButton {{
      background-color: {};
    }}'''.format(color)
    add_rule(css, rule)

  return css

def add_rule(css, rule):
  try:
    css.add(rule)
  except:
    print('Invalid:\n', rule)
