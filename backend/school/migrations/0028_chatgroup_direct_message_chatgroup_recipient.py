# Generated by Django 4.0.4 on 2022-07-12 07:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0027_alter_parent_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatgroup',
            name='direct_message',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chatgroup',
            name='recipient',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='message_recipient', to=settings.AUTH_USER_MODEL),
        ),
    ]
