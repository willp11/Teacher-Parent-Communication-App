# Generated by Django 4.0.4 on 2022-06-28 04:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0008_announcement_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='announcement',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
