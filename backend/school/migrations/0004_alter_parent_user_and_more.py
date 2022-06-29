# Generated by Django 4.0.4 on 2022-06-27 08:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0003_alter_parent_user_alter_teacher_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parent',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='parent', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='parentsettings',
            name='notification_mode',
            field=models.OneToOneField(default='App', on_delete=django.db.models.deletion.DO_NOTHING, to='school.notificationmode'),
        ),
        migrations.AlterField(
            model_name='parentsettings',
            name='parent',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='settings', to='school.parent'),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='teacher', to=settings.AUTH_USER_MODEL),
        ),
    ]