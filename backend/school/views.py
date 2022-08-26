from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
from .utils import check_has_child_in_class, generate_invite_code
from .permissions import *
from .tasks import send_school_class_notifications
from django.core.exceptions import ValidationError

#######################################################################
# ANNOUNCEMENTS
#######################################################################
class AnnouncementCreateView(CreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def perform_create(self, serializer):
        school_class = SchoolClass.objects.get(pk=self.request.data['school_class'])
        serializer.save(school_class=school_class)
        send_school_class_notifications(self.request.user, "Announcement", school_class)

class AnnouncementUpdateView(RetrieveUpdateAPIView):
    serializer_class = AnnouncementUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        announcement = Announcement.objects.get(pk=self.kwargs['pk'])
        return announcement

class AnnouncementDeleteView(RetrieveDestroyAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        announcement = Announcement.objects.get(pk=self.kwargs['pk'])
        return announcement

#######################################################################
# ASSIGNMENTS
#######################################################################
class AssignmentCreateView(CreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def perform_create(self, serializer):
        school_class = SchoolClass.objects.get(pk=self.request.data['school_class'])
        serializer.save(school_class=school_class)

class AssignmentUpdateView(RetrieveUpdateAPIView):
    serializer_class = AssignmentUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        assignment = Assignment.objects.get(pk=self.kwargs['pk'])
        return assignment

class AssignmentDeleteView(RetrieveDestroyAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        assignment = Assignment.objects.get(pk=self.kwargs['pk'])
        return assignment

class AssigneeCreateView(ListCreateAPIView):
    serializer_class = AssigneeCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_queryset(self):
        assignment = Assignment.objects.get(pk=self.kwargs['pk'])
        return Assignee.objects.filter(assignment=assignment)

    # override create so that we can pass a list
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# list of assignees that we want to delete
class AssigneeDeleteListView(ListAPIView, DestroyAPIView):
    serializer_class = AssigneeDeleteSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_queryset(self):
        assignment = Assignment.objects.get(pk=self.kwargs['pk'])
        return Assignee.objects.filter(assignment=assignment)

    # overwrite destroy so can pass in a list
    def destroy(self, request, *args, **kwargs):
        # get all instances
        assignment_objects = []
        for assignee in request.data:
            instance = get_object_or_404(Assignee, assignment=assignee['assignment'], student=assignee['student'])
            assignment_objects.append(instance)
        # delete the instances
        for obj in assignment_objects:
            obj.delete()

        return Response(status=status.HTTP_200_OK)

class AssigneeScoreUpdateView(RetrieveUpdateAPIView):
    serializer_class = AssigneeScoreUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsAssignmentCreator]

    def get_object(self):
        assignee = Assignee.objects.get(pk=self.kwargs['pk'])
        return assignee

    def perform_update(self, serializer):
        assignee = self.get_object()
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        # check score is not larger than assignment's maximum score
        if assignment.maximum_score < int(self.request.data['score']):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

class AssigneeListView(ListAPIView):
    serializer_class = AssigneeListSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        assignment = get_object_or_404(Assignment, pk=self.kwargs['pk'])
        return Assignee.objects.filter(assignment=assignment)

class AssignmentDetailView(RetrieveAPIView):
    serializer_class = AssignmentDetailSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        assignment = get_object_or_404(Assignment, code=self.kwargs['code'])
        return assignment

class AssignmentResponseCreateView(CreateAPIView):
    serializer_class = AssignmentResponseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        assignee = get_object_or_404(Assignee, pk=self.request.data['assignee'])
        if assignee.submitted == True:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            assignee.submitted = True
            assignee.save()
            serializer.save()

#######################################################################
# CHAT GROUPS
#######################################################################

# Get all data for a chat group
class ChatGroupGetView(RetrieveAPIView):
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsChatOwnerOrMember]

    def get_object(self):
        return get_object_or_404(ChatGroup, pk=self.kwargs['pk'])

# Add members to chat group
class ChatGroupAddMembersView(ListCreateAPIView):
    serializer_class = GroupMemberCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsChatOwner]

    def get_queryset(self):
        group = get_object_or_404(ChatGroup, pk=self.kwargs['pk'])
        return GroupMember.objects.filter(group=group)

    # override create so that we can pass a list
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all a user's chat groups they own and are a member of
class ChatGroupUserGetView(RetrieveAPIView):
    serializer_class = UserChatGroupsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        return self.request.user

# Create a non-direct message group chat
class ChatGroupCreateView(CreateAPIView):
    serializer_class = ChatGroupCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        group = serializer.save(group_owner=self.request.user)
        member = GroupMember(user=self.request.user, group=group)
        member.save()

# Create a direct message chat
class ChatGroupDirectCreateView(CreateAPIView):
    serializer_class = ChatGroupCreateDirectSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        group = serializer.save(group_owner=self.request.user, direct_message=True)
        member = GroupMember(user=self.request.user, group=group)
        recipient_user = get_object_or_404(CustomUser, id=self.request.data['recipient'])
        recipient_member = GroupMember(user=recipient_user, group=group)
        member.save()
        recipient_member.save()

class ChatGroupMembersListView(ListAPIView):
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsChatOwnerOrMember]

    def get_queryset(self):
        group = get_object_or_404(ChatGroup, pk=self.kwargs['pk'])
        return GroupMember.objects.filter(group=group)

# Not implemented on frontend
# class ChatGroupDeleteMemberView(RetrieveDestroyAPIView):
#     serializer_class = GroupMemberSerializer
#     permission_classes = [IsAuthenticated, IsEmailVerified]

#     def get_object(self):
#         member = get_object_or_404(GroupMember, pk=self.kwargs['pk'])
#         # check user is either the member or the group owner
#         authorized = False
#         if member.user == self.request.user:
#             authorized = True
#         if member.group.group_owner == self.request.user:
#             authorized = True
#         if authorized == False:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)

#         return member 

#######################################################################
# EVENTS
#######################################################################
class EventCreateView(CreateAPIView):
    serializer_class = EventCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def perform_create(self, serializer):
        school_class = SchoolClass.objects.get(pk=self.request.data['school_class'])
        serializer.save(school_class=school_class)
        send_school_class_notifications(self.request.user, "Event", school_class)

class EventUpdateView(RetrieveUpdateAPIView):
    serializer_class = EventUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        event = Event.objects.get(pk=self.kwargs['pk'])
        return event

class EventDeleteView(RetrieveDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        event = Event.objects.get(pk=self.kwargs['pk'])
        return event

class HelperCreateView(CreateAPIView):
    serializer_class = HelperSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # check user is a parent
        parent = get_object_or_404(Parent, user=self.request.user)
        # get event
        event = get_object_or_404(Event, pk=self.request.data['event'])
        # check don't already have enough helpers
        all_helpers = Helper.objects.filter(event=event)
        if len(all_helpers) < event.helpers_required:
            # check parent has child in the class
            children = Student.objects.filter(parent=parent)
            has_child_in_class = check_has_child_in_class(children, event.school_class)
            if has_child_in_class == False:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            # check not already signed up
            helpers = Helper.objects.filter(parent=parent, event=event)
            if len(helpers) > 0:
                return Response(status=status.HTTP_403_FORBIDDEN)
            serializer.save(event=event, parent=parent)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN) 

class HelperDeleteView(RetrieveDestroyAPIView):
    serializer_class = HelperSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        event = get_object_or_404(Event, pk=self.kwargs['pk'])
        parent = get_object_or_404(Parent, user=self.request.user)
        helper = get_object_or_404(Helper, parent=parent, event=event)
        return helper

#######################################################################
# NOTIFICATIONS
#######################################################################

# Get only unread notifications for the user
class UnreadNotificationsGetView(APIView):

    def get_chat_queryset(self, user):
        try:
            return ChatGroupNotification.objects.filter(user=user, read=False)
        except:
            raise status.HTTP_400_BAD_REQUEST

    def get_schoolclass_queryset(self, user):
        try:
            return SchoolClassNotification.objects.filter(user=user, read=False)
        except:
            raise status.HTTP_400_BAD_REQUEST

    def get(self, request, *args, **kwargs):
        chat_instances = self.get_chat_queryset(request.user)
        chat_serializer = ChatGroupNotificationSerializer(chat_instances, many=True)
        schoolclass_instances = self.get_schoolclass_queryset(request.user)
        schoolclass_serializer = SchoolClassNotificationSerializer(schoolclass_instances, many=True)
        all_instances = []
        all_instances.extend(chat_serializer.data)
        all_instances.extend(schoolclass_serializer.data)
        return Response(all_instances)

# Update one chat notification
class ChatNotificationUpdateView(RetrieveUpdateAPIView):
    serializer_class = ChatNotificationUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        return ChatGroupNotification.objects.get(pk=self.kwargs['pk'], user=self.request.user)

# Update one school class notification
class ClassNotificationUpdateView(RetrieveUpdateAPIView):
    serializer_class = ClassNotificationUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        return SchoolClassNotification.objects.get(pk=self.kwargs['pk'], user=self.request.user)

# Update all notifications for user, set read=True
class AllNotificationUpdateView(APIView):

    def get_chat_queryset(self, user):
        try:
            return ChatGroupNotification.objects.filter(user=user, read=False)
        except ValidationError:
            raise status.HTTP_400_BAD_REQUEST

    def get_schoolclass_queryset(self, user):
        try:
            return SchoolClassNotification.objects.filter(user=user, read=False)
        except ValidationError:
            raise status.HTTP_400_BAD_REQUEST

    def put(self, request, *args, **kwargs):
        chat_instances = self.get_chat_queryset(request.user)
        school_class_instances = self.get_schoolclass_queryset(request.user)
        instances = []
        instances.extend(chat_instances)
        instances.extend(school_class_instances)
        for obj in instances:
            obj.read = True
            obj.save()
        return Response(data="success", status=200)

#######################################################################
# PROFILE
#######################################################################
class ParentCreateView(CreateAPIView):
    serializer_class = ParentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        parent = serializer.save(user=self.request.user)
        settings = ParentSettings(parent=parent)
        settings.save()

class TeacherCreateView(CreateAPIView):
    serializer_class = TeacherCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProfilePictureUpdateView(RetrieveUpdateAPIView):
    serializer_class = ProfilePictureSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        return self.request.user

class SchoolCreateView(ListCreateAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]
    queryset = School.objects.all()

class TeacherSchoolUpdateView(RetrieveUpdateAPIView):
    serializer_class = TeacherCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        teacher = get_object_or_404(Teacher, user=self.request.user)
        return teacher

class ClassCreateView(CreateAPIView):
    serializer_class = ClassCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        serializer.save(teacher=teacher, school=teacher.school)

class InviteCodeUseView(RetrieveUpdateAPIView):
    serializer_class = InviteCodeOnlySerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # unused invite code
        invite_code = get_object_or_404(InviteCode, code=self.request.data['code'], used=False)
        return invite_code

    def perform_update(self, serializer):
        invite_code = self.get_object()
        parent = get_object_or_404(Parent, user=self.request.user)
        serializer.save(parent=parent, user=True)
        student = invite_code.student
        student.parent = parent
        student.save()

class ParentSettingsUpdateView(RetrieveUpdateAPIView):
    serializer_class = ParentSettingsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        parent = get_object_or_404(Parent, user=self.request.user)
        settings = get_object_or_404(ParentSettings, parent=parent)
        return settings

class SettingsUpdateView(RetrieveUpdateAPIView):
    serializer_class = SettingsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        settings = get_object_or_404(Settings, user=self.request.user)
        return settings

#######################################################################
# SCHOOL CLASS
#######################################################################
class ClassDetailView(RetrieveAPIView):
    serializer_class = ClassDetailSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        class_id = self.kwargs['pk']
        return get_object_or_404(SchoolClass, pk=class_id)

#######################################################################
# STORIES
#######################################################################
class StoryCreateView(CreateAPIView):
    serializer_class = StoryCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def perform_create(self, serializer):
        school_class = SchoolClass.objects.get(pk=self.request.data['school_class'])
        serializer.save(school_class=school_class)
        send_school_class_notifications(self.request.user, "Story", school_class)

class StoryUpdateView(RetrieveUpdateAPIView):
    serializer_class = StoryUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        story = Story.objects.get(pk=self.kwargs['pk'])
        return story

class StoryDeleteView(RetrieveDestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        story = Story.objects.get(pk=self.kwargs['pk'])
        return story

class StoryMediaCreateView(CreateAPIView):
    serializer_class = StoryMediaSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # get story 
        story = get_object_or_404(Story, pk=self.request.data['story'])
        # user must be teacher of the class that story belongs to
        get_object_or_404(SchoolClass, pk=story.school_class.pk, teacher=teacher)
        serializer.save(story=story)

class StoryCommentCreateView(CreateAPIView):
    serializer_class = StoryCommentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # parent = get_object_or_404(Parent, user=self.request.user)
        can_comment = False
        story = get_object_or_404(Story, pk=self.request.data['story'])

        # check if user is a teacher or parent
        teachers = Teacher.objects.filter(user=self.request.user)
        parents = Parent.objects.filter(user=self.request.user)
        if len(teachers) == 1:
            # check if is the teacher of the class
            teacher = teachers[0]
            if teacher == story.school_class.teacher:
                can_comment = True
        if len(parents) == 1:
            parent = parents[0]
            # check parent has child in the class
            children = Student.objects.filter(parent=parent)
            has_child_in_class = check_has_child_in_class(children, story.school_class)
            if has_child_in_class == True:
                can_comment = True

        if can_comment == False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer.save(author=self.request.user)

class StoryCommentListView(ListAPIView):
    serializer_class = StoryCommentListSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs['pk'])
        return StoryComment.objects.filter(story=story)

# Not implemented update comments on frontend
# class StoryCommentUpdateView(RetrieveUpdateAPIView):
#     serializer_class = StoryCommentUpdateSerializer
#     permission_classes = [IsAuthenticated, IsEmailVerified]

#     def get_object(self):
#         comment = get_object_or_404(StoryComment, pk=self.kwargs['pk'])
#         if comment.author != self.request.user:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)
#         return comment

#######################################################################
# STUDENTS
#######################################################################
class StudentCreateView(CreateAPIView):
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.data['school_class'], teacher=teacher)
        student = serializer.save(school_class=school_class)

        valid_code = False
        while valid_code == False:
            # create parent invite
            invite_code = generate_invite_code()
            # check invite code is unique
            if len(InviteCode.objects.filter(code=invite_code)) == 0:
                valid_code = True
        
        invite_serializer = InviteCodeCreateSerializer(data={'student': student.pk, 'code': invite_code, 'used': False})
        if invite_serializer.is_valid():
            invite_serializer.save()
        else:
            student.delete()
            return Response(status=status.HTTP_400_BAD_REQUEST)

class StudentDeleteView(RetrieveDestroyAPIView):
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsClassTeacher]

    def get_object(self):
        student = Student.objects.get(pk=self.kwargs['pk'])
        return student

class StudentNameUpdateView(RetrieveUpdateAPIView):
    serializer_class = StudentNameSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        student = Student.objects.get(pk=self.kwargs['pk'])
        return student

class StudentImageUpdateView(RetrieveUpdateAPIView):
    serializer_class = StudentImageSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        student = Student.objects.get(pk=self.kwargs['pk'])
        return student

class StickerCreateView(CreateAPIView):
    serializer_class = StickerSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # get student
        student = get_object_or_404(Student, pk=self.request.data['student'])
        # check user is teacher of the student's class
        if student.school_class.teacher.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer.save()

#######################################################################
# STUDENT PROFILE
#######################################################################
class StudentPortfolioGetView(RetrieveAPIView):
    serializer_class = StudentPortfolioSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsStudentParentOrTeacher]

    def get_object(self):
        student = get_object_or_404(Student, pk=self.kwargs['pk'])
        return student

#######################################################################
# CONTACTS
#######################################################################
class TeacherContactsGetListView(RetrieveAPIView):
    serializer_class = TeacherContactsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        teacher = get_object_or_404(Teacher, user=self.request.user)
        return teacher

class ParentContactsGetListView(RetrieveAPIView):
    serializer_class = ParentContactsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        parent = get_object_or_404(Parent, user=self.request.user)
        return parent