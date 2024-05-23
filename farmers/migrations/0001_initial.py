# Generated by Django 5.0.1 on 2024-01-16 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Farmer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('farmer_code', models.TextField(max_length=255, unique=True)),
                ('farmer_name', models.TextField(max_length=255)),
                ('gender', models.TextField(max_length=20)),
                ('age', models.IntegerField()),
                ('address', models.TextField(max_length=255)),
                ('phone_number', models.TextField(max_length=20)),
                ('email', models.TextField(max_length=255)),
                ('village', models.TextField(max_length=255)),
                ('location', models.TextField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'farmer_details',
            },
        ),
    ]