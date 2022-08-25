from django.db import models
from accounts.models import CustomUser
from django.utils.crypto import get_random_string

def create_assignment_code():
    return get_random_string(8)

class School(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return '{} in {}'.format(self.name, self.city)

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher')
    school = models.ForeignKey(School,  on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return '{} in {}'.format(self.user.first_name, self.user.last_name)

class Parent(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='parent')

    def __str__(self):
        return '{}'.format(self.user.email)

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='school_classes')
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Announcement(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1024)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='announcements')
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Student(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(Parent, on_delete=models.SET_NULL, related_name='children', null=True, blank=True)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='students')
    image = models.ImageField(upload_to='student_pictures/', null=True, blank=True)

    def __str__(self):
        return self.name

    # delete image if student is deleted
    def delete(self, using=None, keep_parents=False):
        storage = self.image.storage

        if self.image and storage.exists(self.image.name):
            storage.delete(self.image.name)

        super().delete()

class Assignment(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=512)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='assignments')
    maximum_score = models.IntegerField(null=True, blank=True)

    TEXT = 'Text'
    IMAGE = 'Image'
    VIDEO = 'Video'
    RESPONSE_FORMAT_CHOICES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
    ]
    response_format = models.CharField(max_length=16, choices=RESPONSE_FORMAT_CHOICES, default=TEXT)
    code = models.CharField(max_length=8, unique=True, default=create_assignment_code)

    def __str__(self):
        return self.title

class Assignee(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='assigned_students')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='portfolio')
    feedback = models.CharField(max_length=1024, null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    submitted = models.BooleanField(default=False)

    def __str__(self):
        return '{} assigned to {}'.format(self.student.name, self.assignment.title)

    class Meta:
        unique_together = ('student', 'assignment')

class AssignmentResponse(models.Model):
    assignee = models.ForeignKey(Assignee, on_delete=models.CASCADE, related_name='assignment_responses')
    text = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='assignment_media/', null=True, blank=True)
    video = models.FileField(upload_to='assignment_media/', null=True, blank=True)

class Story(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1024)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='stories')
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class StoryMedia(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='story_images')
    image = models.ImageField(upload_to="story_media/", null=True, blank=True)

class StoryComment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_comments')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='story_comments')
    content = models.CharField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{} comment on {}'.format(self.author.username, self.story.title)

class Event(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now=False)
    description = models.CharField(max_length=512)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='events')
    helpers_required = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return self.name

class Helper(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='helping_at')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='helpers')

class StickerType(models.Model):
    name = models.CharField(max_length=100)
    image = models.FileField(upload_to="sticker_images/")

    def __str__(self):
        return self.name

class Sticker(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='stickers')
    type = models.ForeignKey(StickerType, on_delete=models.CASCADE)

# class AppNotification(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
#     title = models.CharField(max_length=100)
#     content = models.CharField(max_length=256)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return '{} to {} {}'.format(self.title, self.user.first_name, self.user.last_name)

class NotificationMode(models.Model):
    APP = 'App'
    EMAIL = 'Email'
    SMS = 'SMS'
    NOTIFICATION_CHOICES = [
        (APP, 'App'),
        (EMAIL, 'Email'),
        (SMS, 'SMS'),
    ]
    name = models.CharField(max_length=16, choices=NOTIFICATION_CHOICES, default=APP, primary_key=True)

    def __str__(self):
        return self.name

class ParentSettings(models.Model):
    parent = models.OneToOneField(Parent, on_delete=models.CASCADE, related_name='settings')
    notification_mode = models.ForeignKey(NotificationMode, on_delete=models.SET_DEFAULT, default='App')
    message_received_notification = models.BooleanField(default=True)
    new_story_notification = models.BooleanField(default=False)
    new_announcement_notification = models.BooleanField(default=False)
    new_event_notification = models.BooleanField(default=False)

    def __str__(self):
        return self.parent.user.username

class ChatGroup(models.Model):
    name = models.CharField(max_length=100)
    group_owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat_groups_owned')
    direct_message = models.BooleanField(default=False)
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='message_recipient', null=True, blank=True)

    def __str__(self):
        return self.name

class GroupMember(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat_group_member')
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name='chat_members')
    connected_to_call = models.BooleanField(default=False)
    connected_to_chat = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'group')

    def __str__(self):
        return '{} {} in {}'.format(self.user.first_name, self.user.last_name, self.group.name)

class Message(models.Model):
    sender = models.ForeignKey(GroupMember, on_delete=models.SET_NULL, null=True)
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name='chat_messages')
    content = models.CharField(max_length=1024)
    time = models.DateTimeField(auto_now=True)

class InviteCode(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='invite_code')
    code = models.CharField(max_length=8, unique=True)
    parent = models.ForeignKey(Parent, on_delete=models.SET_NULL, null=True, blank=True)
    used = models.BooleanField(default=False)

    def __str__(self):
        return self.code

class ChatGroupNotification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat_notifications')
    MESSAGE = 'Message'
    VIDEO = 'Video'
    TYPE_CHOICES = [
        (MESSAGE, 'Message'),
        (VIDEO, 'Video')
    ]
    type = models.CharField(max_length=8, choices=TYPE_CHOICES, default=MESSAGE)
    title = models.CharField(max_length=64)
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    read = models.BooleanField(default=False)
    qty_missed = models.IntegerField(default=1)

    def __str__(self):
        return '{} in {}'.format(self.user.first_name, self.group.name)