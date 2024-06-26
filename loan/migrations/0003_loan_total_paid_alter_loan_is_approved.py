# Generated by Django 5.0.1 on 2024-05-22 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0002_loan_is_approved'),
    ]

    operations = [
        migrations.AddField(
            model_name='loan',
            name='total_paid',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='loan',
            name='is_approved',
            field=models.IntegerField(default=0),
        ),
    ]
