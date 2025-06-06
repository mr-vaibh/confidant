# Generated by Django 5.1.4 on 2025-04-04 18:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_profile_public_key'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(choices=[('success', 'Success'), ('info', 'Information'), ('warning', 'Warning'), ('alert', 'Alert')], default='info', max_length=50)),
                ('url', models.URLField(blank=True, default='')),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read_at', models.DateTimeField(blank=True, null=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='accounts.profile')),
            ],
            options={
                'verbose_name': 'Notification',
                'ordering': ['-created_at'],
            },
        ),
    ]
