#!/bin/bash
python manage.py loaddata whole.json
python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic && gunicorn --workers 2 DaniApp.wsgi
