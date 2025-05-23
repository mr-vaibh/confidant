# Generated by Django 5.1.4 on 2025-03-30 23:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_usage', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BillingPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Free', 'Free'), ('Basic', 'Basic'), ('Pro', 'Pro')], max_length=10, unique=True)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('api_call_limit', models.IntegerField()),
                ('secrets_limit', models.IntegerField()),
                ('team_members', models.IntegerField()),
                ('version_history_days', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='UserBilling',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_calls_used', models.IntegerField(default=0)),
                ('secrets_used', models.IntegerField(default=0)),
                ('next_billing_date', models.DateField()),
                ('plan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api_usage.billingplan')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
