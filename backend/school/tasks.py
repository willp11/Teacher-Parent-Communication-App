from celery import shared_task
from .models import *
from django.core.mail import send_mail

# Create message and missed call notifications - used by the chat/call consumers
@shared_task
def send_chat_group_notifications(sender, type, group):
    if type == 'Message':
        group_members = GroupMember.objects.filter(group=group)
        for member in group_members:
            if member.user != sender and member.connected_to_chat == False:
                # find notification object
                notifications = ChatGroupNotification.objects.filter(user=member.user, type=type, group=group, read=False)

                # create new notification object
                if len(notifications) == 0:
                    new_notification = ChatGroupNotification(user=member.user, type=type, title='New messages received', group=group)
                    new_notification.save()

                    # check if user wants email notification for new message
                    parent_settings = Settings.objects.get(user=member.user)
                    if parent_settings.message_received_notification == True:
                        send_mail(
                            'Message received',
                            'You have unread messages',
                            'admin@app.com',
                            ['parent@test.com'],
                            fail_silently=True
                        )
                # update notification object
                elif len(notifications) == 1:
                    notification = notifications[0]
                    notification.qty_missed += 1
                    notification.save()
                else:
                    raise Exception('Should not have multiple unread notifications for same user and chat group')
    elif type == 'IsCalling':
        group_members = GroupMember.objects.filter(group=group)
        for member in group_members:
            if member.user != sender:
                new_notification = ChatGroupNotification(user=member.user, type=type, title='Someone is calling', group=group)
                new_notification.save()
    elif type == 'CallCancelled':
        group_members = GroupMember.objects.filter(group=group)
        for member in group_members:
            if member.user != sender :
                # update IsCalling notification to a MissedCall notification
                notifications = ChatGroupNotification.objects.filter(user=member.user, type='IsCalling', group=group)
                for notification in notifications:
                    notification.delete()
                    notification.type = type
                    notification.title = "Missed call"
                    notification.save()

# Create event, announcement, story  - used by the views when teacher creates new
@shared_task
def send_school_class_notifications(user, type, school_class):
    # try:
    # check user is the teacher of the school_class
    if user != school_class.teacher.user:
        raise Exception('Not authorized')
    
    # get eligible parents
    parents = []
    parent_emails = []
    students = Student.objects.filter(school_class=school_class)

    if type == 'Announcement':
        title = "New announcement"
        content = 'There is a new class announcement'
    if type == 'Event':
        title = "New event"
        content = 'There is a new class event'
    if type == 'Story':
        title = "New story"
        content = 'There is a new class story'

    for student in students:
        if student.parent != None:
            # get list of all parents of students in the class
            parents.append(student.parent)
            # check settings whether to send email
            parent_settings = Settings.objects.get(user=student.parent.user)
            if type == 'Announcement':
                if parent_settings.new_announcement_notification == True:
                    parent_emails.append(student.parent.user.email)
            if type == 'Event':
                if parent_settings.new_event_notification == True:
                    parent_emails.append(student.parent.user.email)
            if type == 'Story':
                if parent_settings.new_story_notification == True:
                    parent_emails.append(student.parent.user.email)
    
    # create notification for each parent
    for parent in parents:
        new_notification = SchoolClassNotification(user=parent.user, type=type, title=title, school_class=school_class)
        new_notification.save()

    # send emails to parents
    send_mail(
        title,
        content,
        'admin@app.com',
        parent_emails,
        fail_silently=True
    )
    # except:
    #     print("error sending school class notifications")

