# Generated by Django 5.0.1 on 2024-02-18 18:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cws', '0005_cherrygradeoutput_grade_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryOutput',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('output', models.CharField(default=None, max_length=100)),
                ('desc', models.CharField(max_length=200)),
                ('grade_name', models.CharField(max_length=20)),
                ('grade', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grade_id', to='cws.cherrygrade')),
            ],
            options={
                'db_table': 'inventory_outputs',
            },
        ),
    ]
