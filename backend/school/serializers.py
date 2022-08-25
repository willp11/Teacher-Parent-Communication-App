from rest_framework import serializers
from .models import *

#######################################################################
# SERIALIZERS USED WITHIN OTHER SERIALIZERS BUT NOT WITHIN ANY VIEWS
#######################################################################

# Used by many other serializers
class UserNameOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name')

# Used by ClassDetailSerializer
class StudentNameImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name', 'image')

# used by HelperParentDataSerializer, StudentParentSerializer, StudentPortfolioSerializer
class ParentNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = Parent
        fields = ('user',)

# Used by EventSerializer
class HelperParentDataSerializer(serializers.ModelSerializer):
    parent = ParentNameSerializer()
    class Meta:
        model = Helper
        fields = ('parent',)

# Used by TeacherSerializer
class ClassNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name',)

# Used by MessageSerializer
class ChatGroupMemberNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = GroupMember
        fields = ('user',)

# Used by ChatGroupSerializer
class MessageSerializer(serializers.ModelSerializer):
    sender = ChatGroupMemberNameSerializer()
    class Meta:
        model = Message
        fields = '__all__'

# Used by SchoolClassSerializer, ClassDetailSerializer, StudentsClassInfoSerializer, ParentContactsClassStudentsSerializer
class TeacherNameSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    class Meta:
        model = Teacher
        fields = ('user',)

# Used by ClassDetailSerializer
class StudentNameImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name', 'image')

#######################################################################
# ANNOUNCEMENTS
#######################################################################
# Used by AnnouncementCreateView, AnnouncementDeleteView and ClassDetailSerializer
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

# Used by AnnouncementUpdateView
class AnnouncementUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ('title', 'content')

#######################################################################
# ASSIGNMENTS
#######################################################################
# Used by AssignmentCreateView, AssignmentDeleteView
class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

# Used by AssignmentUpdateView
class AssignmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('title', 'description', 'maximum_score', 'response_format')

# Used by AssigneeCreateView
class AssigneeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id', 'assignment', 'student')

# Used by AssigneeDeleteListView
class AssigneeDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id',)

# used by AssignmentResponseCreateView
class AssignmentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentResponse
        fields = '__all__'

# Used by AssigneeListSerializer and StudentNameUpdateView
class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('name',)

# used by AssigneeListView
class AssigneeListSerializer(serializers.ModelSerializer):
    student = StudentNameSerializer()
    assignment_responses = AssignmentResponseSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses')

# Used by AssigneeScoreUpdateView
class AssigneeScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk', 'score', 'feedback')

# Get all data about an assignment - including all students it is assigned to and their responses
class AssignmentDetailSerializer(serializers.ModelSerializer):
    assigned_students = AssigneeListSerializer(many=True)
    class Meta:
        model = Assignment
        fields = ('title', 'description', 'maximum_score', 'response_format', 'assigned_students', )

#######################################################################
# CHAT GROUPS
#######################################################################
# Used by ChatGroupGetView
class ChatGroupSerializer(serializers.ModelSerializer):
    group_owner = UserNameOnlySerializer()
    recipient = UserNameOnlySerializer()
    chat_members = ChatGroupMemberNameSerializer(many=True)
    chat_messages = MessageSerializer(many=True)
    class Meta:
        model = ChatGroup
        fields = ('id', 'name', 'direct_message', 'recipient', 'group_owner', 'chat_members', 'chat_messages')

# Used byChatGroupAddMembersView
class GroupMemberCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ('user', 'group')

# used by UserChatGroupsSerializer, ChatGroupMembersListView
class GroupMemberSerializer(serializers.ModelSerializer):
    user = UserNameOnlySerializer()
    group = ChatGroupSerializer()
    class Meta:
        model = GroupMember
        fields = '__all__'

# Used by ChatGroupUserGetView
class UserChatGroupsSerializer(serializers.ModelSerializer):
    chat_group_member = GroupMemberSerializer(many=True)
    class Meta:
        model = CustomUser
        fields = ('chat_group_member',)

# Used by ChatGroupCreateView, ChatGroupNotificationSerializer
class ChatGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('id', 'name',)

# Used by ChatGroupDirectCreateView
class ChatGroupCreateDirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('id', 'name', 'recipient')

#######################################################################
# EVENTS
#######################################################################

# EventCreateView
class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date', 'description', 'school_class', 'helpers_required')

# EventUpdateView
class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date', 'description', 'helpers_required')

# HelperCreateView, HelperDeleteView
class HelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helper
        fields = ('event',)

# EventDeleteView, ClassDetailSerializer
class EventSerializer(serializers.ModelSerializer):
    helpers = HelperParentDataSerializer(many=True)
    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'description', 'school_class', 'helpers_required', 'helpers')

#######################################################################
# PROFILE
#######################################################################
# ParentCreateView
class ParentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('user',)

# TeacherCreateView
class TeacherCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('school',)

# ProfilePictureUpdateView
class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('profile_picture',)

# ClassDetailSerializer, StudentsClassInfoSerializer
class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

# ClassCreateView
class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = ('name',)

# UserProfileSerializer
class TeacherSerializer(serializers.ModelSerializer):
    school = SchoolSerializer()
    school_classes = ClassNameSerializer(many=True)
    class Meta:
        model = Teacher
        fields = ('id', 'school', 'school_classes')

# InviteCodeOnlyView, StudentPortfolioSerializer
class InviteCodeOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteCode
        fields = ('code',)

# ParentSettingsUpdateView
class ParentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentSettings
        exclude = ('parent',)

# Used by StudentSerializer
class SchoolClassSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()
    class Meta:
        model = SchoolClass
        fields = '__all__'

# Used by ParentSerializer
class StudentSerializer(serializers.ModelSerializer):
    school_class = SchoolClassSerializer()
    class Meta:
        model = Student
        fields = '__all__'

# Used by UserProfileSerializer
class ParentSerializer(serializers.ModelSerializer):
    settings = ParentSettingsSerializer()
    children = StudentSerializer(many=True)
    class Meta:
        model = Parent
        fields = '__all__'

#######################################################################
# STORIES
#######################################################################
# StoryCreateView
class StoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('title', 'content', 'school_class')

# StoryUpdateView
class StoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('title', 'content')

# StoryMediaCreateView
class StoryMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryMedia
        fields = '__all__'

# ClassDetailSerializer, StoryDeleteView
class StorySerializer(serializers.ModelSerializer):
    story_images = StoryMediaSerializer(many=True)
    class Meta:
        model = Story
        fields = '__all__'

# StoryCommentListView
class StoryCommentListSerializer(serializers.ModelSerializer):
    author = UserNameOnlySerializer()
    class Meta:
        model = StoryComment
        fields = '__all__'

# StoryCommentCreateView
class StoryCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryComment
        fields = ('content', 'story')

# Unused - Haven't implemented updating comments on frontend
# class StoryCommentUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = StoryComment
#         fields = ('content', 'updated_at',)

#######################################################################
# STUDENTS
#######################################################################
# StudentCreateView
class InviteCodeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteCode
        fields = ('student', 'code', 'used')

# StudentCreateView
class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('pk', 'name', 'school_class')

# StudentImageUpdateView
class StudentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('image',)

# StickerCreateView, StudentPortfolioSerializer
class StickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sticker
        fields = '__all__'

#######################################################################
# SCHOOL CLASS
#######################################################################
# ClassDetailView
class ClassDetailSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()
    announcements = AnnouncementSerializer(many=True)
    events = EventSerializer(many=True)
    stories = StorySerializer(many=True)
    students = StudentNameImageSerializer(many=True)
    assignments = AssignmentSerializer(many=True)

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'school', 'teacher', 'announcements', 'events', 'stories', 'students', 'assignments')

#######################################################################
# SCHOOL PROFILE
#######################################################################
# StudentPortfolioSerializer
class StudentsClassInfoSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    school = SchoolSerializer()

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'school', 'teacher')

# StudentPortfolioSerializer
class PortfolioItemSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer()
    assignment_responses = AssignmentResponseSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('assignment', 'feedback', 'score', 'assignment_responses')

# StudentPortfolioGetView
class StudentPortfolioSerializer(serializers.ModelSerializer):
    parent = ParentNameSerializer()
    school_class = StudentsClassInfoSerializer()
    portfolio = PortfolioItemSerializer(many=True)
    stickers = StickerSerializer(many=True)
    invite_code = InviteCodeOnlySerializer()

    class Meta:
        model = Student
        fields = ('pk', 'name', 'parent', 'school_class', 'portfolio', 'stickers', 'invite_code')

#######################################################################
# CONTACTS
#######################################################################

# TEACHER CONTACTS
# ClassStudentsSerializer
class StudentParentSerializer(serializers.ModelSerializer):
    parent = ParentNameSerializer()
    class Meta:
        model = Student
        fields = ('id', 'name', 'parent')

# TeacherContactsSerializer
class ClassStudentsSerializer(serializers.ModelSerializer):
    students = StudentParentSerializer(many=True)
    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'students',)

# Shows all the teachers classes, with a full list of students names + parent names for each class
class TeacherContactsSerializer(serializers.ModelSerializer):
    school_classes = ClassStudentsSerializer(many=True)
    class Meta:
        model = Teacher
        fields = ('school_classes',)

# PARENT CONTACTS
# ParentContactsStudentSerializer
class ParentContactsClassStudentsSerializer(serializers.ModelSerializer):
    teacher = TeacherNameSerializer()
    students = StudentParentSerializer(many=True)
    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'teacher', 'students',)

# ParentContactsSerializer
class ParentContactsStudentSerializer(serializers.ModelSerializer):
    school_class = ParentContactsClassStudentsSerializer()
    class Meta:
        model = Student
        fields = ('id', 'name', 'school_class')

# Shows all the parent's children, with the teacher and parents of all other students in their class
class ParentContactsSerializer(serializers.ModelSerializer):
    children = ParentContactsStudentSerializer(many=True)
    class Meta:
        model = Parent
        fields = ('id', 'children')


#######################################################################
# NOTIFICATIONS
#######################################################################
# UserNotificationsSerializer
class ChatGroupNotificationSerializer(serializers.ModelSerializer):
    group = ChatGroupCreateSerializer()
    class Meta:
        model = ChatGroupNotification
        fields = '__all__'

class SchoolClassNotificationSerializer(serializers.ModelSerializer):
    school_class = SchoolClassSerializer()
    class Meta:
        model = SchoolClassNotification
        fields = '__all__'

# NotificationsGetView
class UserNotificationsSerializer(serializers.ModelSerializer):
    chat_notifications = ChatGroupNotificationSerializer(many=True)
    school_class_notifications = SchoolClassNotificationSerializer(many=True)
    class Meta:
        model = CustomUser
        fields = ('chat_notifications', 'school_class_notifications')

# NotificationUpdateView
class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroupNotification
        fields = ('read',)