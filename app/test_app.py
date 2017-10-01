import os
import unittest
import sys
from .app import app

class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
      self.app = app.test_client()

    def test_top(self):
      res = self.app.get('/')
      assert(res.status_code == 200)

if __name__ == '__main__':
  unittest.main()
