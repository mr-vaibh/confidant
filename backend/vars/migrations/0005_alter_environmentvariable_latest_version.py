# Generated by Django 5.1.2 on 2024-11-05 21:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vars', '0004_alter_environmentvariable_latest_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='environmentvariable',
            name='latest_version',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='latest_for_variable', to='vars.variableversion'),
        ),
    ]
