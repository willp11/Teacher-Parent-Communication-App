# Generated by Django 4.0.4 on 2022-07-04 05:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0021_alter_schoolclass_teacher'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schoolclass',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='school_classes', to='school.teacher'),
        ),
    ]