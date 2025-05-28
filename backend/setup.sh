#!/bin/bash

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p static media frontend_static

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py createsuperuser --noinput || true

# Collect static files
python manage.py collectstatic --noinput

# Create initial tenant
python manage.py create_tenant_superuser --username admin --email admin@example.com --noinput || true

echo "Setup completed successfully!" 