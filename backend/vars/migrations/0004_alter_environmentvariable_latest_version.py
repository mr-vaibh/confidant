# Generated by Django 5.1.2 on 2024-11-05 17:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vars', '0003_alter_variableversion_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='environmentvariable',
            name='latest_version',
            field=models.OneToOneField(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='latest_for_variable', to='vars.variableversion'),
        ),
    ]
