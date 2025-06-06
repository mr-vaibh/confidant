# Generated by Django 5.1.2 on 2024-11-05 05:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vars', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='environmentvariable',
            options={'ordering': ['-created_at'], 'verbose_name': 'Environment Variable', 'verbose_name_plural': 'Environment Variables'},
        ),
        migrations.AlterModelOptions(
            name='variableversion',
            options={'ordering': ['-created_at'], 'verbose_name': 'Variable Version', 'verbose_name_plural': 'Variable Versions'},
        ),
        migrations.AddField(
            model_name='environmentvariable',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='environmentvariable',
            name='latest_version',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='latest_for_variable', to='vars.variableversion'),
        ),
        migrations.AddField(
            model_name='environmentvariable',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='environmentvariable',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_vars', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='variableversion',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_versions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='variableversion',
            name='value',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='variableversion',
            name='version',
            field=models.PositiveIntegerField(),
        ),
    ]
