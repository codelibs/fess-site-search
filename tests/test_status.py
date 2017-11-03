import requests

ROOT_URL = 'http://localhost:5000'

def test_status_codes():
  pages = [
    "/", "/docs/manual"
  ]
  for p in pages:
    res = requests.get(ROOT_URL + p)
    assert res.status_code == 200
