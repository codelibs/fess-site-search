import requests
import re
import random
import time

ROOT_URL = 'http://localhost:5000'


def check_webpack(response):
    regex = re.compile(ROOT_URL + '/demo/(.*)')
    match = regex.search(response.url)
    if not match:
        return False

    js_id = match.group(1)
    print(js_id)
    print(response.url)

    # webpack must terminate within 10 sec.
    for i in range(100):
        res = requests.get(ROOT_URL + '/api/check_js/' + js_id).json()
        if res['result']:
            assert i > 5  # webpack must be a time-consuming task
            return True

        time.sleep(0.1)

    return False  # Timeout


def rand_col():
    return '#{:X}{:X}{:X}'.format(*[random.randint(0, 255) for _ in range(3)])


def test_wizard():
    form = {
        'font-family': 'Arial, sans-serif',
        'border-color': rand_col(),
        'bg-color': rand_col(),
        'searchbox-border-color': rand_col(),
        'button-border-color': 'orange',
        'button-bg-color': 'blue'
    }
    res = requests.post(ROOT_URL + '/generator', data=form)
    assert res.status_code == 200

    assert check_webpack(res)


def create_random_css(filename):
    rand_css = '''
        .fessWrapper {{
          background-color: {0};
          font-family: Times, serif;
        }}

        .fessWrapper #searchButton {{
          border: solid {1};
        }}

        .fessWrapper #result li {{
          background-color: {2};
        }}
    '''.format(rand_col(), rand_col(), rand_col())

    with open(filename, 'w') as f:
        f.write(rand_css)


def test_upload():
    css_file = 'tests/sample.css'
    create_random_css(css_file)
    files = {'file': open(css_file, 'r')}

    res = requests.post(ROOT_URL + '/generator', files=files)
    assert res.status_code == 200

    assert check_webpack(res)
