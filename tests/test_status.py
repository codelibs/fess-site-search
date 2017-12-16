import requests

ROOT_URL = 'http://localhost:5000'


def test_status_codes():
    pages = [
        '', '/ja',
        '/docs/manual', '/ja/docs/manual',
        '/generator'
    ]
    for p in pages:
        res = requests.get(ROOT_URL + p)
        assert res.status_code == 200
