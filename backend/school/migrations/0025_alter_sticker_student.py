# Generated by Django 4.0.4 on 2022-07-06 05:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0024_alter_assignment_school_class_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sticker',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stickers', to='school.student'),
        ),
    ]
