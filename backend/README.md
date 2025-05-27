# Multi-tenant Website Builder Backend

This is the Django backend for the multi-tenant website builder application. It provides APIs for managing tenants and their websites.

## Features

- Multi-tenant architecture using django-tenant-schemas
- RESTful APIs for tenant and website management
- Integration with Supabase for website storage
- CORS support for frontend integration

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Node.js 16+ (for frontend)

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a PostgreSQL database:
```bash
createdb website_builder
```

4. Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

5. Run migrations:
```bash
python manage.py migrate_schemas
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

## API Endpoints

### Public Schema (http://localhost:8000/api/)
- `GET /tenants/` - List all tenants
- `POST /tenants/` - Create a new tenant
- `GET /tenants/{id}/` - Get tenant details
- `PUT /tenants/{id}/` - Update tenant
- `DELETE /tenants/{id}/` - Delete tenant

### Tenant Schema (http://{tenant-domain}/api/)
- `GET /websites/` - List all websites for the tenant
- `POST /websites/` - Create a new website
- `GET /websites/{id}/` - Get website details
- `PUT /websites/{id}/` - Update website
- `DELETE /websites/{id}/` - Delete website

## Development

1. Create a new tenant:
```bash
python manage.py shell
>>> Tenant.objects.create(name='Test Tenant', schema_name='test')
```

2. Access the tenant's API:
```bash
curl -H "Host: test.localhost:8000" http://localhost:8000/api/websites/
```

## Production Deployment

1. Set `DJANGO_DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
3. Set up a production database
4. Configure a production web server (e.g., Nginx)
5. Use a production-grade WSGI server (e.g., Gunicorn)

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords for the database and Django admin
- Enable HTTPS in production
- Regularly update dependencies
- Monitor database access and API usage 