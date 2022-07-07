from rest_framework import serializers
from .models import *

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username',)

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
        fields = ('invite_code',)

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
        fields = ('title', 'description', 'maximum_score')

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

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name', 'date', 'description', 'helpers_required')

class StoryCommentListSerializer(serializers.ModelSerializer):
    author = UsernameSerializer()
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

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class StoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('title', 'content')

class StoryMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryMedia
        fields = '__all__'

class ClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = '__all__'

class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name')

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

class AssigneeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id', 'assignment', 'student')

class AssigneeDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('id',)

class AssignmentMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentMedia
        fields = ('__all__')

class AssigneeScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk', 'score')

class AssigneeInPortfolioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk', 'in_portfolio')

class PortfolioItemSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer()
    assignment_media = AssignmentMediaSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('assignment', 'feedback', 'score', 'assignment_media')

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

class StudentPortfolioSerializer(serializers.ModelSerializer):
    portfolio = PortfolioItemSerializer(many=True)
    stickers = StickerSerializer(many=True)
    invite_code = InviteCodeOnlySerializer()
    school_class = StudentsClassInfoSerializer()
    class Meta:
        model = Student
        fields = ('pk', 'name', 'parent', 'school_class', 'portfolio', 'stickers', 'invite_code')

class RequestHelpersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('pk', 'helpers_required')

class HelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helper
        fields = ('event',)

# CHAT GROUPS
class ChatGroupSerializer(serializers.ModelSerializer):
    group_owner = UserNameOnlySerializer()
    class Meta:
        model = ChatGroup
        fields = ('id', 'name', 'group_owner',)

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

# create group - don't need owner as request.user is owner
class ChatGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('id', 'name',)

# Serializers to get a user's chat groups
class UserChatGroupsSerializer(serializers.ModelSerializer):
    chat_groups_owned = ChatGroupSerializer(many=True)
    chat_group_member = GroupMemberSerializer(many=True)
    class Meta:
        model = CustomUser
        fields = ('chat_groups_owned', 'chat_group_member')


# MESSAGES
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('group', 'content')

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