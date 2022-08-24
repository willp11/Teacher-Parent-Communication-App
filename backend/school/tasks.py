from celery import shared_task
from .models import *

# Tasks to create notifications
@shared_task
def send_app_notifications(sender, type, group):
    # notification = {type, title, group, time, read_at, qty_missed}
    # e.g. {type:'message', title: 'Unread messages', chatGroup: pk, time: '12:00:00', read_at: '11:30:00', qty_missed: 4,} onClick=navigate to chat group
    # e.g. {type:'call', title: 'Missed call', chatGroup: pk, time: '11:30:00', read_at: null, qty_missed: 1} onClick=navigate to call
    # e.g. {type:'event', title: 'New event', schoolClass: pk, time: '11:30:00', read_at: '11:02:00', qty_missed: 1} onClick=navigate to events

    print("sending notification")

    if type == 'Message':
        group_members = GroupMember.objects.filter(group=group)
        for member in group_members:
            if member.user != sender:
                # find notification object
                notifications = ChatGroupNotification.objects.filter(user=member.user, type=type, group=group, read=False)
                # create new notification object
                if len(notifications) == 0:
                    print("creating notification for {} in group {}".format(member.user, group))
                    new_notification = ChatGroupNotification(user=member.user, type='Message', title='New messages received', group=group)
                    new_notification.save()
                # update notification object
                elif len(notifications) == 1:
                    notification = notifications[0]
                    notification.qty_missed += 1
                    notification.save()
                else:
                    raise Exception('Should not have multiple unread notifications for same user and chat group')


                # create notification object
                # notification = ChatGroupNotification()

    # type = message, call, announcement, story, event
    # foreign key ChatGroup for message notifications
    # foreign key SchoolClass for event, announcement, story notifications
    # => two tables: ChatGroupNotification, SchoolClassNotification

    # when user navigates to chat group
    # check if user has a notification instance with type 'message'
    # if has: update 'read_at=datetime.now()', 'qty_missed=0'

    # when message is sent
    # find/create notification instance for all members of the group, if have already unread one then update it, else create a new one
    # if already has one: update 'time=datetime.now()', 'qty_missed'+=1 'read_at'=null
    # else create new one: 'time=datetime.now()', 'qty_missed'+=1, 'read_at'=null. Send email to email recipients

    # notification page
    # order by: unread newest->oldest, read newest->oldest

    # chat hub
    # parents: next to name show qty_missed for both direct message and call
    # order parents and groups by qty_missed>0 and last message received time

    ## call send_app_notifications('event', ...) from EventCreateView
    # if type == 'event':
    # find all parents of children in the class, 
    # SchoolClassNotification.objects.filter_by(user: parent.user, ) for each parent and save to db

    # iterate over all parents
    # check their settings - see if want messages for notifications of this type
    # 