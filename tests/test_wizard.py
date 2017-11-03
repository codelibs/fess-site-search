import requests
import re
import time

ROOT_URL = 'http://localhost:5000'

def test_wizard():
  form = {'bg-color': '#FF0000', 'button-color': 'blue'}
  res = requests.post(ROOT_URL, data=form)
  assert res.status_code == 200

  regex = re.compile(ROOT_URL + '/demo/(.*)')
  match = regex.search(res.url)
  assert match

  js_id = match.group(1)

  # webpack must terminate within 10 sec.
  for i in range(100):
    res = requests.get(ROOT_URL + '/api/check_js/' + js_id).json()
    if res['result']:
      return True

    time.sleep(0.1)

  assert False # Timeout
