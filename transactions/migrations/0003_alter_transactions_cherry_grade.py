# Generated by Django 5.0.1 on 2024-05-06 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_dailypurchasevalidation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactions',
            name='cherry_grade',
            field=models.CharField(max_length=2),
        ),
    ]
