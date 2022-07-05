from rest_framework import serializers
from .models import *

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

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'school', 'teacher', 'announcements', 'events', 'stories', 'students')

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
        fields = ('pk', 'assignment', 'student')

class AssigneeDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = ('pk')

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
    assignment_media = AssignmentMediaSerializer(many=True)
    class Meta:
        model = Assignee
        fields = ('assignment', 'feedback', 'score', 'assignment_media')

class StudentPortfolioSerializer(serializers.ModelSerializer):
    portfolio = PortfolioItemSerializer(many=True)
    class Meta:
        model = Student
        fields = ('pk', 'name', 'parent', 'school_class', 'portfolio')

class RequestHelpersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('pk', 'helpers_required')

class HelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helper
        fields = ('event',)

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username',)

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

class ChatGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ('name',)

class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = '__all__'

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