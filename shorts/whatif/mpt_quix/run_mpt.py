# Runs MoneyPrinterTurbo's cli.py with Edge TTS routed through this environment's HTTPS proxy + CA bundle.
import os, sys, runpy, certifi, edge_tts
CA = '/root/.ccr/ca-bundle.crt'
certifi.where = lambda: CA
_orig = edge_tts.Communicate.__init__
def _init(self, *a, **k):
    k.setdefault('proxy', os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy'))
    _orig(self, *a, **k)
edge_tts.Communicate.__init__ = _init
sys.argv = ['cli.py'] + sys.argv[1:]
runpy.run_path('cli.py', run_name='__main__')
