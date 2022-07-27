from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return '{} {}'.format(self.first_name, self.last_name)

    # delete profile picture image if user is deleted
    def delete(self, using=None, keep_parents=False):
        storage = self.profile_picture.storage

        if self.profile_picture and storage.exists(self.profile_picture.name):
            storage.delete(self.profile_picture.name)

        super().delete()