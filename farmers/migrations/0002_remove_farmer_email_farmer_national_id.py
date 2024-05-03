# Generated by Django 5.0.1 on 2024-01-17 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('farmers', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='farmer',
            name='email',
        ),
        migrations.AddField(
            model_name='farmer',
            name='national_id',
            field=models.TextField(default=0, max_length=20, unique=True),
        ),
    ]
