from celery import shared_task
from .models import *

# Create message and missed call notifications - used by the chat/call consumers
@shared_task
def send_chat_group_notifications(sender, type, group):
    # ChatGroupNotification = {type, title, group, updated_at, read, qty_missed}
    # SchoolClassNotification = {type, title, school_class, updated_at, read, qty_missed}

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
        


    # type = message, call, announcement, story, event
    # foreign key ChatGroup for message notifications
    # foreign key SchoolClass for event, announcement, story notifications
    # => two tables: ChatGroupNotification, SchoolClassNotification


# Create event, announcement, story  - used by the views when teacher creates new
@shared_task
def send_school_class_notifications(user, type, school_class):
    try:
        # check user is the teacher of the school_class
        if user != school_class.teacher.user:
            raise Exception('Not authorized')
        
        # get eligible parents
        parents = []
        students = Student.objects.filter(school_class=school_class)
        for student in students:
            if student.parent != None:
                parent_settings = ParentSettings.objects.get(parent=student.parent)
                if type == 'Announcement':
                    title = "New announcement"
                    if parent_settings.new_announcement_notification == True:
                        parents.append(student.parent)
                if type == 'Event':
                    title = "New event"
                    if parent_settings.new_event_notification == True:
                        parents.append(student.parent)
                if type == 'Story':
                    title = "New story"
                    if parent_settings.new_story_notification == True:
                        parents.append(student.parent)
            
        # create notification for each parent
        for parent in parents:
            print(parent)
            new_notification = SchoolClassNotification(user=parent.user, type=type, title=title, school_class=school_class)
            new_notification.save()
    except:
        print("error sending school class notifications")

