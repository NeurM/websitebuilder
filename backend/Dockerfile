# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE website_builder.settings

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs /app/static /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Create a non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Run gunicorn
CMD ["gunicorn", "--config", "gunicorn_config.py", "website_builder.wsgi:application"] 