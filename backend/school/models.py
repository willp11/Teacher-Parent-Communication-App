from time import time
from tkinter import CASCADE
from django.db import models
from accounts.models import CustomUser

class School(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name + self.city

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher')
    school = models.ForeignKey(School,  on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username

class Parent(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='parent')
    invite_code = models.CharField(max_length=8)

    def __str__(self):
        return self.user.username

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(Parent, on_delete=models.SET_NULL, related_name='children', null=True, blank=True)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Assignment(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=512)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
    maximum_score = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

class Assignee(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='portfolio')
    feedback = models.CharField(max_length=1024, null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    in_portfolio = models.BooleanField(default=False)

    def __str__(self):
        return self.student.name + self.assignment.title

class AssignmentMedia(models.Model):
    assignee = models.ForeignKey(Assignee, on_delete=models.CASCADE, related_name='assignment_media')
    file = models.FileField(upload_to="assignment_media/")
    
class Story(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1024)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='stories')

    def __str__(self):
        return self.title

class StoryMedia(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    file = models.FileField(upload_to="story_media/")
    description = models.CharField(max_length=256, null=True, blank=True)

class StoryComment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_comments')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='story_comments')
    content = models.CharField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author.username + ' ' + self.story.title + ' ' + self.created_at

class Announcement(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1024)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='announcements')
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

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
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    type = models.ForeignKey(StickerType, on_delete=models.CASCADE)

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

    def __str__(self):
        return self.name

class GroupMember(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat_group_member')
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name='chat_members')

    class Meta:
        unique_together = ('user', 'group')

class Message(models.Model):
    sender = models.ForeignKey(GroupMember, on_delete=models.SET_NULL, null=True)
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE)
    content = models.CharField(max_length=1024)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.sender + ' ' + self.time

class InviteCode(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='invite_code')
    code = models.CharField(max_length=8, unique=True)
    parent = models.ForeignKey(Parent, on_delete=models.SET_NULL, null=True, blank=True)
    used = models.BooleanField(default=False)

    def __str__(self):
        return self.code