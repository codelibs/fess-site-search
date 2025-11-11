import random
import re
import time

import requests

ROOT_URL = 'http://localhost:5000'


def check_webpack(response):
    regex = re.compile(ROOT_URL + '/demo/(.*)')
    match = regex.search(response.url)
    if not match:
        print(f"ERROR: Could not extract js_id from URL: {response.url}")
        return False

    js_id = match.group(1)
    print(f"Checking webpack build for js_id: {js_id}")
    print(f"Response URL: {response.url}")

    # webpack must terminate within 60 sec.
    for i in range(600):  # 600 * 0.1 = 60 seconds total
        res = requests.get(ROOT_URL + '/api/check_js/' + js_id).json()
        if res['result']:
            print(f"Build completed after {i * 0.1:.1f} seconds")
            assert i > 5  # webpack must be a time-consuming task
            return True

        # Print progress every 5 seconds
        if i % 50 == 0 and i > 0:
            print(f"Still waiting for build... ({i * 0.1:.1f}s elapsed)")

        time.sleep(0.1)

    print(f"ERROR: Build timeout after 60 seconds for js_id: {js_id}")
    return False  # Timeout


def rand_col():
    return '#{:X}{:X}{:X}'.format(*[random.randint(0, 255) for _ in range(3)])


def test_wizard():
    print("\n=== Starting test_wizard ===")
    form = {
        'font-family': 'Arial, sans-serif',
        'border-color': rand_col(),
        'bg-color': rand_col(),
        'searchbox-border-color': rand_col(),
        'button-border-color': 'orange',
        'button-bg-color': 'blue'
    }
    print(f"Posting form data: {form}")
    res = requests.post(ROOT_URL + '/generator', data=form)
    print(f"Response status: {res.status_code}, URL: {res.url}")
    assert res.status_code == 200

    result = check_webpack(res)
    print(f"test_wizard result: {'PASS' if result else 'FAIL'}")
    assert result


def create_random_css(filename):
    rand_css = f'''
        .fessWrapper {{
          background-color: {rand_col()};
          font-family: Times, serif;
        }}

        .fessWrapper .searchButton {{
          border: solid {rand_col()};
        }}

        .fessWrapper #result li {{
          background-color: {rand_col()};
        }}
    '''

    with open(filename, 'w') as f:
        f.write(rand_css)


def test_upload():
    print("\n=== Starting test_upload ===")
    css_file = 'tests/sample.css'
    create_random_css(css_file)
    print(f"Created CSS file: {css_file}")
    files = {'file': open(css_file)}

    print("Posting CSS file upload")
    res = requests.post(ROOT_URL + '/generator', files=files)
    print(f"Response status: {res.status_code}, URL: {res.url}")
    assert res.status_code == 200

    result = check_webpack(res)
    print(f"test_upload result: {'PASS' if result else 'FAIL'}")
    assert result
