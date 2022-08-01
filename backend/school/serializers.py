from rest_framework import serializers
from .models import *

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('profile_picture',)

class UserNameOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name')

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class ClassNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name',)

class TeacherSerializer(serializers.ModelSerializer):
    school = SchoolSerializer()
    school_classes = ClassNameSerializer(many=True)
    class Meta:
        model = Teacher
        fields = ('id', 'school', 'school_classes')

class TeacherCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('school',)

class TeacherNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = Teacher
        fields = ('user',)

class ParentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('user',)

class ParentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentSettings
        exclude = ('parent',)

class SchoolClassSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()
    class Meta:
        model = SchoolClass
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    school_class = SchoolClassSerializer()
    class Meta:
        model = Student
        fields = '__all__'

class StudentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('image',)

class ParentSerializer(serializers.ModelSerializer):
    settings = ParentSettingsSerializer()
    children = StudentSerializer(many=True)
    class Meta:
        model = Parent
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class AssignmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('title', 'description', 'maximum_score', 'response_format')

class AssigneeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class AnnouncementUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ('title', 'content')

class StoryCommentListSerializer(serializers.ModelSerializer):
    author = UserNameOnlySerializer()
    class Meta:
        model = StoryComment
        fields = '__all__'

class StoryCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryComment
        fields = ('content', 'story')

class StoryCommentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryComment
        fields = ('content', 'updated_at',)

class StoryMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryMedia
        fields = '__all__'

class StoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('title', 'content', 'school_class')

class StorySerializer(serializers.ModelSerializer):
    story_images = StoryMediaSerializer(many=True)
    class Meta:
        model = Story
        fields = '__all__'

class StoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('title', 'content')

class ClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = '__all__'

class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name', 'image')

# Serializers to get all a teacher's classes with the list of students and parent's names
class ParentNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = Parent
        fields = ('user',)

# For create and delete Helper instances
class HelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helper
        fields = ('event',)

# For nested Helper instances - retrieved with all Event data - provides data on the parents
class HelperParentDataSerializer(serializers.ModelSerializer):
    parent = ParentNameSerializer()
    class Meta:
        model = Helper
        fields = ('parent',)

# Events - for retrieving event data
class EventSerializer(serializers.ModelSerializer):
    helpers = HelperParentDataSerializer(many=True)
    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'description', 'school_class', 'helpers_required', 'helpers')

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date', 'description', 'school_class', 'helpers_required')

# Updating event instances
class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date', 'description', 'helpers_required')

class RequestHelpersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('pk', 'helpers_required')

class ClassDetailSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()
    announcements = AnnouncementSerializer(many=True)
    events = EventSerializer(many=True)
    stories = StorySerializer(many=True)
    students = StudentNameSerializer(many=True)
    assignments = AssignmentSerializer(many=True)

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'school', 'teacher', 'announcements', 'events', 'stories', 'students', 'assignments')

class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = ('name',)

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('pk', 'name', 'school_class')

class StudentUpdateNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('name',)

class AssignmentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentResponse
        fields = '__all__'

class AssigneeListSerializer(serializers.ModelSerializer):
    student = StudentUpdateNameSerializer()
    assignment_responses = AssignmentResponseSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses')

class AssigneeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id', 'assignment', 'student')

class AssigneeDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id',)

# class AssignmentMediaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AssignmentMedia
#         fields = ('__all__')

class AssigneeScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk', 'score', 'feedback')

class AssigneeInPortfolioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk', 'in_portfolio')

# Get all data about an assignment - including all students it is assigned to and their responses
class AssignmentDetailSerializer(serializers.ModelSerializer):
    assigned_students = AssigneeListSerializer(many=True)
    class Meta:
        model = Assignment
        fields = ('title', 'description', 'maximum_score', 'response_format', 'assigned_students', )

class PortfolioItemSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer()
    assignment_responses = AssignmentResponseSerializer(many=True)
    # assignment_media = AssignmentMediaSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('assignment', 'feedback', 'score', 'assignment_responses')

class StickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sticker
        fields = '__all__'

class InviteCodeOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteCode
        fields = ('code',)

class StudentsClassInfoSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'school', 'teacher')

# CHAT GROUPS
class ChatGroupMemberNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = GroupMember
        fields = ('user',)

# MESSAGES
class MessageSerializer(serializers.ModelSerializer):
    sender = ChatGroupMemberNameSerializer()
    class Meta:
        model = Message
        fields = '__all__'

class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('group', 'content')

class ChatGroupSerializer(serializers.ModelSerializer):
    group_owner = UserNameOnlySerializer()
    recipient = UserNameOnlySerializer()
    chat_members = ChatGroupMemberNameSerializer(many=True)
    chat_messages = MessageSerializer(many=True)
    class Meta:
        model = ChatGroup
        fields = ('id', 'name', 'direct_message', 'recipient', 'group_owner', 'chat_members', 'chat_messages')

class GroupMemberSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    group = ChatGroupSerializer()
    class Meta:
        model = GroupMember
        fields = '__all__'

# add members to group
class GroupMemberCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ('user', 'group')

# create group - don't need owner as request.user is owner - non direct message group
class ChatGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('id', 'name',)

# create direct message group
class ChatGroupCreateDirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('id', 'name', 'recipient')

# Serializers to get a user's chat groups
# class UserChatGroupsSerializer(serializers.ModelSerializer):
#     chat_groups_owned = ChatGroupSerializer(many=True)
#     chat_group_member = GroupMemberSerializer(many=True)
#     class Meta:
#         model = CustomUser
#         fields = ('chat_groups_owned', 'chat_group_member')

# Serializers to get a user's chat groups they are a member of
class UserChatGroupsSerializer(serializers.ModelSerializer):
    chat_group_member = GroupMemberSerializer(many=True)
    class Meta:
        model = CustomUser
        fields = ('chat_group_member',)

class InviteCodeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteCode
        fields = ('student', 'code', 'used')

# Serializers to get all a teacher's classes with the list of students and parent's names
class ParentNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = Parent
        fields = ('user',)

class StudentParentSerializer(serializers.ModelSerializer):
    parent = ParentNameSerializer()
    class Meta:
        model = Student
        fields = ('id', 'name', 'parent')

class ClassStudentsSerializer(serializers.ModelSerializer):
    students = StudentParentSerializer(many=True)
    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'students',)

class TeacherContactsSerializer(serializers.ModelSerializer):
    school_classes = ClassStudentsSerializer(many=True)
    class Meta:
        model = Teacher
        fields = ('school_classes',)

# Parent contacts - need their children, with each child's school class. 
# The school class must provide the teacher and list of all students with their parent
class ParentContactsClassStudentsSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    students = StudentParentSerializer(many=True)
    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'teacher', 'students',)

class ParentContactsStudentSerializer(serializers.ModelSerializer):
    school_class = ParentContactsClassStudentsSerializer()
    class Meta:
        model = Student
        fields = ('id', 'name', 'school_class')

class ParentContactsSerializer(serializers.ModelSerializer):
    children = ParentContactsStudentSerializer(many=True)
    class Meta:
        model = Parent
        fields = ('id', 'children')

# Get all student data
class StudentPortfolioSerializer(serializers.ModelSerializer):
    portfolio = PortfolioItemSerializer(many=True)
    stickers = StickerSerializer(many=True)
    invite_code = InviteCodeOnlySerializer()
    school_class = StudentsClassInfoSerializer()
    parent = ParentNameSerializer()
    class Meta:
        model = Student
        fields = ('pk', 'name', 'parent', 'school_class', 'portfolio', 'stickers', 'invite_code')

# In app notifications
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppNotification
        fields = '__all__'

# Get all in app notifications for a given user
class UserNotificationsSerializer(serializers.ModelSerializer):
    notifications = NotificationSerializer(many=True)
    class Meta:
        model = CustomUser
        fields = ('notifications',)