from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return '{} {}'.format(self.first_name, self.last_name)