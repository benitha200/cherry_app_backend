"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

# import os

# from django.core.wsgi import get_wsgi_application

# os.environ["DJANGO_SETTINGS_MODULE"] = "main.settings"

# application = get_wsgi_application()

"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import sys

# Path to the virtual environment
venv_path = 'C:/apache24/htdocs/cherry_app_backend/venv'

# Add the virtual environment's site-packages to the sys.path
site_packages = os.path.join(venv_path, 'Lib', 'site-packages')
sys.path.insert(0, site_packages)

# Add the project directory to the PYTHONPATH
sys.path.insert(0, 'C:/apache24/htdocs/cherry_app_backend')

# Set the environment variable for the Django settings module
os.environ["DJANGO_SETTINGS_MODULE"] = "main.settings"

# Import Django's WSGI application
from django.core.wsgi import get_wsgi_application

os.environ["DJANGO_SETTINGS_MODULE"] = "main.settings"

application = get_wsgi_application()
