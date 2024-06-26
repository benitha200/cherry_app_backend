# Generated by Django 5.0.1 on 2024-05-06 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyPurchaseValidation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('cherry_grade', models.CharField(max_length=2)),
                ('cherry_kg', models.FloatField()),
                ('amount', models.FloatField()),
            ],
            options={
                'db_table': 'daily_purchase_validation',
            },
        ),
    ]
