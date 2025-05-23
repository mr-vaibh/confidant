# Generated by Django 5.1.2 on 2024-11-08 20:34

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vars', '0006_alter_environmentvariable_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='environmentvariable',
            constraint=models.UniqueConstraint(fields=('name', 'created_by'), name='unique_name_per_user'),
        ),
    ]
