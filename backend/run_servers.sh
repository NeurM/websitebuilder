#!/bin/bash

# Kill any existing processes on ports 8000 and 8001
kill $(lsof -t -i:8000) 2>/dev/null
kill $(lsof -t -i:8001) 2>/dev/null

# Set Django settings module
export DJANGO_SETTINGS_MODULE=website_builder.settings

# Start WSGI server (Gunicorn)
gunicorn website_builder.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 120 --access-logfile - --error-logfile - &

# Start ASGI server (Daphne)
daphne -b 0.0.0.0 -p 8001 website_builder.asgi:application --access-log - &

# Wait for both processes
wait 