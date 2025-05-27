from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('tenants', '0002_add_created_on_to_domain'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenant',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ] 