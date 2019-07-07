import subprocess
import os
import sys
from multiprocessing import BoundedSemaphore

# To share 'semaphore' among multiple workers on gunicorn, use '--preload' option
semaphore = BoundedSemaphore(int(os.environ.get('APP_WEBPACK_LIMIT', '2')))


class _WPManager():
    """
    Used in 'WebpackManager'.
    """

    def __init__(self):
        self.semaphore = semaphore

    def run(self, folder, instance_path, fname):

        if not self.semaphore.acquire(False):
            return False

        # Parent process: return 'True' immediately if fork is succeeded
        # Child process : executes 'webpack', releases semaphore and exits
        try:
            pid = os.fork()
            if pid == 0:  # Child
                (cwd, cmd) = self.gen_command(instance_path)
                my_env = self.gen_exec_env(folder, fname)
                proc = subprocess.Popen(cmd, env=my_env, cwd=cwd)
                outs, errs = proc.communicate()
            else:
                return True
        except OSError:
            self.semaphore.release()
            return False
        else:
            assert(pid == 0)
            self.semaphore.release()
            sys.exit()

        assert(pid == 0)
        self.semaphore.release()
        sys.exit()

    def gen_command(self, path):
        cwd = os.path.join(path, '../fss')
        cmd = '{0}/node_modules/.bin/webpack --config {0}/webpack.config.js'.format(cwd)
        return (cwd, cmd.split())

    def gen_exec_env(self, folder, fname):
        my_env = os.environ.copy()
        jsfile = 'fess-ss-{}.min.js'.format(fname)

        my_env['INPUT_JSON_PATH'] = '{}/{}.json'.format(folder, fname)
        my_env['INPUT_CSS_PATH'] = '{}/{}.css'.format(folder, fname)
        my_env['OUTPUT_JS_FILENAME'] = jsfile

        print('generate_js: ({}, {}) -> {}'.format(my_env['INPUT_JSON_PATH'], my_env['INPUT_CSS_PATH'], my_env['OUTPUT_JS_FILENAME']))
        return my_env


class WebpackManager():  # Singleton
    """
    This class keeps the number of webpack processes from exceeding 'APP_WEBPACK_LIMIT'.
    """
    _instance = None

    def __init__(self):
        pass

    def __new__(cls):
        if cls._instance is None:
            cls._instance = _WPManager()

        return cls._instance

    def run(self, folder, instance_path, fname):
        return self._instance.run(folder, instance_path, fname)
