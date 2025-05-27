import multiprocessing
import os

# Gunicorn config
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 3
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# SSL (uncomment and configure if using SSL)
# keyfile = '/path/to/keyfile'
# certfile = '/path/to/certfile'

# Process naming
proc_name = 'website_builder'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Server hooks
def on_starting(server):
    pass

def on_reload(server):
    pass

def on_exit(server):
    pass 