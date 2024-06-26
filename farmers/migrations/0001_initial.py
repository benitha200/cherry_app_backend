# Generated by Django 5.0.1 on 2024-05-23 13:45

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
                ('cws', models.TextField(default=None, max_length=255)),
                ('farmer_code', models.TextField(max_length=255, unique=True)),
                ('farmer_name', models.TextField(max_length=255)),
                ('gender', models.TextField(max_length=20)),
                ('age', models.IntegerField()),
                ('address', models.TextField(max_length=255)),
                ('phone_number', models.TextField(max_length=20)),
                ('national_id', models.TextField(default=0, max_length=20, unique=True)),
                ('village', models.TextField(max_length=255)),
                ('location', models.TextField(max_length=255)),
                ('is_certified', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.IntegerField(default=0, null=True)),
            ],
            options={
                'db_table': 'farmer_details',
            },
        ),
        migrations.CreateModel(
            name='FarmerAndFarmDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cws_name', models.TextField(default=None, max_length=255)),
                ('cws_code', models.TextField(default=None, max_length=255)),
                ('farmer_code', models.CharField(max_length=100, unique=True)),
                ('farmer_name', models.TextField(max_length=255)),
                ('gender', models.TextField(max_length=20)),
                ('dob', models.DateField()),
                ('phone_number', models.TextField(max_length=20)),
                ('national_id', models.TextField(default=0, max_length=20, unique=True)),
                ('location', models.TextField(max_length=255)),
                ('is_certified', models.BooleanField(default=True)),
                ('polygon', models.TextField()),
                ('plot_name', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.IntegerField(default=0, null=True)),
            ],
            options={
                'db_table': 'farmer_and_farm_details',
            },
        ),
    ]
