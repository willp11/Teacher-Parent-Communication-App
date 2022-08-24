from celery import shared_task
from .models import *

# Tasks to create notifications
@shared_task
def send_app_notifications():
    print("sending notification")