#!/bin/bash

# Activate virtual environment
source ../venv/bin/activate

# Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE website_builder;" || true

# Set environment variables
export DJANGO_SETTINGS_MODULE=website_builder.settings
export DJANGO_DEBUG=True
export DB_NAME=website_builder
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432
export REDIS_URL=redis://localhost:6379/0

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser --username admin --email admin@example.com --noinput || true

# Create initial tenant
python manage.py create_tenant --schema_name=public --name="Public Tenant" --domain-domain=localhost --domain-is_primary=True || true

# Create tenant superuser
python manage.py create_tenant_superuser --username admin --email admin@example.com --noinput -s public || true

echo "Database setup completed!" 