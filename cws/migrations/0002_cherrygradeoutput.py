# Generated by Django 5.0.1 on 2024-02-15 09:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cws', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CherryGradeOutput',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('outputs', models.CharField(default=None, max_length=100)),
                ('desc', models.CharField(max_length=200)),
                ('grade', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grade_output', to='cws.cherrygrade')),
            ],
            options={
                'db_table': 'cherry_grade_outputs',
            },
        ),
    ]
