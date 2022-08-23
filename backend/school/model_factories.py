import factory
from .models import *
import datetime

class SchoolFactory(factory.django.DjangoModelFactory):
    name = "Test School"
    city = "London"
    country = "UK"

    class Meta:
        model = School

class TeacherFactory(factory.django.DjangoModelFactory):
    school = factory.SubFactory(SchoolFactory)

    class Meta:
        model = Teacher

class ParentFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Parent

class SchoolClassFactory(factory.django.DjangoModelFactory):
    teacher = factory.SubFactory(TeacherFactory)
    school = factory.SubFactory(SchoolFactory)

    class Meta:
        model = SchoolClass

class AnnouncementFactory(factory.django.DjangoModelFactory):
    title = "New announcement"
    content = "An announcement"
    school_class = factory.SubFactory(SchoolClassFactory)

    class Meta:
        model = Announcement

class AssignmentFactory(factory.django.DjangoModelFactory):
    title = "New assignment"
    description = "An assignment"
    school_class = factory.SubFactory(SchoolClassFactory)
    maximum_score = 12
    response_format = "Text"
    code = "AAAAAAAA"

    class Meta:
        model = Assignment

class StudentFactory(factory.django.DjangoModelFactory):
    name = "Jim"
    school_class = factory.SubFactory(SchoolClassFactory)

    class Meta:
        model = Student

class AssigneeFactory(factory.django.DjangoModelFactory):
    assignment = factory.SubFactory(AssignmentFactory)
    student = factory.SubFactory(StudentFactory)

    class Meta:
        model = Assignee

class ChatGroupFactory(factory.django.DjangoModelFactory):
    name = "Test group"
    direct_message = False

    class Meta:
        model = ChatGroup

class GroupMemberFactory(factory.django.DjangoModelFactory):
    group = factory.SubFactory(ChatGroupFactory)
    connected_to_call = False
    connected_to_chat = False

    class Meta:
        model = GroupMember

class MessageFactory(factory.django.DjangoModelFactory):
    sender = factory.SubFactory(GroupMemberFactory)
    group = factory.SubFactory(ChatGroupFactory)
    content = "hello"

    class Meta:
        model = Message

class EventFactory(factory.django.DjangoModelFactory):
    name = "Test event"
    date = datetime.date.today()
    description = "An event"
    school_class = factory.SubFactory(SchoolClassFactory)
    helpers_required = 2

    class Meta:
        model = Event

class HelperFactory(factory.django.DjangoModelFactory):
    parent = factory.SubFactory(ParentFactory)
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = Helper

class NotificationModeFactory(factory.django.DjangoModelFactory):
    name = 'App'

    class Meta:
        model = NotificationMode

class InviteCodeFactory(factory.django.DjangoModelFactory):
    student = factory.SubFactory(StudentFactory)
    code = "AAAAAAAA"
    parent = None
    used = False

    class Meta:
        model = InviteCode

class ParentSettingsFactory(factory.django.DjangoModelFactory):
    parent = factory.SubFactory(ParentFactory)
    notification_mode = factory.SubFactory(NotificationModeFactory)
    message_received_notification = True
    new_story_notification = False
    new_announcement_notification = False
    new_event_notification = False

    class Meta:
        model = ParentSettings

class StoryFactory(factory.django.DjangoModelFactory):
    title = "Test Story"
    content = "A test story"
    school_class = factory.SubFactory(SchoolClassFactory)

    class Meta:
        model = Story

class StoryCommentFactory(factory.django.DjangoModelFactory):
    story = factory.SubFactory(StoryFactory)
    content = "A comment"

    class Meta:
        model = StoryComment