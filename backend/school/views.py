from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
from .utils import check_has_child_in_class, generate_invite_code
from .permissions import IsEmailVerified

class SchoolCreateView(ListCreateAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]
    queryset = School.objects.all()

class TeacherCreateView(CreateAPIView):
    serializer_class = TeacherCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TeacherSchoolUpdateView(RetrieveUpdateAPIView):
    serializer_class = TeacherCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        teacher = get_object_or_404(Teacher, user=self.request.user)
        return teacher

class ParentCreateView(CreateAPIView):
    serializer_class = ParentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # check invite code is valid
        invite_code = get_object_or_404(InviteCode, code=self.request.data['invite_code'], used=False)
        # save parent instance
        parent = serializer.save(user=self.request.user)
        # update invite code instance
        invite_code.parent = parent
        invite_code.used = True
        invite_code.save()
        # update student instance
        student = invite_code.student
        student.parent = parent
        student.save()
        # create parent settings instance
        settings = ParentSettings(parent=parent)
        settings.save()


class PortfolioListView(ListAPIView):
    serializer_class = AssigneeSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        student_id = self.kwargs['student']
        student = get_object_or_404(Student, pk=student_id)
        return Assignee.objects.filter(student=student, in_portfolio=True)

class ClassDetailView(RetrieveAPIView):
    serializer_class = ClassDetailSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        class_id = self.kwargs['pk']
        return get_object_or_404(SchoolClass, pk=class_id)

class ClassCreateView(CreateAPIView):
    serializer_class = ClassCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        serializer.save(teacher=teacher)

class StudentCreateView(CreateAPIView):
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
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
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of the class that the student belongs to
        student = get_object_or_404(Student, pk=self.kwargs['pk'])
        school_class = get_object_or_404(SchoolClass, pk=student.school_class.pk)
        if school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return student

class AnnouncementCreateView(CreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class EventCreateView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class StoryCreateView(CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class StoryMediaCreateView(CreateAPIView):
    serializer_class = StoryMediaSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # get story 
        story = get_object_or_404(Story, pk=self.request.POST['story'][0])
        # user must be teacher of the class that story belongs to
        get_object_or_404(SchoolClass, pk=story.school_class.pk, teacher=teacher)
        serializer.save(story=story)

class AssignmentCreateView(CreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class AssigneeCreateView(ListCreateAPIView):
    serializer_class = AssigneeCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignment = get_object_or_404(Assignment, pk=self.kwargs['pk'])
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Assignee.objects.filter(assignment=assignment)

    # override create so that we can pass a list
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssigneeDeleteView(DestroyAPIView):
    serializer_class = AssigneeDeleteSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignee = get_object_or_404(Assignee, pk=self.kwargs['pk'])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return assignee

class AssignmentMediaCreateView(CreateAPIView):
    serializer_class = AssignmentMediaSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # user must be teacher of class that assignment is set for
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignee = get_object_or_404(Assignee, pk=self.request.POST['assignee'][0])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer.save()

class AssigneeScoreUpdateView(RetrieveUpdateAPIView):
    serializer_class = AssigneeScoreUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignee = get_object_or_404(Assignee, pk=self.kwargs['pk'])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return assignee

    def perform_update(self, serializer):
        assignee = self.get_object()
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        # check score is not larger than assignment's maximum score
        if assignment.maximum_score < int(self.request.data['score']):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

class AssigneeInPortfolioUpdateView(RetrieveUpdateAPIView):
    serializer_class = AssigneeInPortfolioUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignee = get_object_or_404(Assignee, pk=self.kwargs['pk'])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return assignee

class StudentPortfolioGetView(RetrieveAPIView):
    serializer_class = StudentPortfolioSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        student = get_object_or_404(Student, pk=self.kwargs['pk'])
        if student.school_class.teacher.user != self.request.user and student.parent.user != self.request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return student

class EventRequestHelpersUpdateView(RetrieveUpdateAPIView):
    serializer_class = RequestHelpersSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        event = get_object_or_404(Event, pk=self.kwargs['pk'])
        if teacher != event.school_class.teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return event

class HelperCreateView(CreateAPIView):
    serializer_class = HelperSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # check user is a parent
        parent = get_object_or_404(Parent, user=self.request.user)
        # get event
        event = get_object_or_404(Event, pk=self.request.data['event'])
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

class HelperDeleteView(RetrieveDestroyAPIView):
    serializer_class = HelperSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        event = get_object_or_404(Event, pk=self.kwargs['pk'])
        parent = get_object_or_404(Parent, user=self.request.user)
        helper = get_object_or_404(Helper, parent=parent, event=event)
        return helper

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

class StoryCommentUpdateView(RetrieveUpdateAPIView):
    serializer_class = StoryCommentUpdateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        comment = get_object_or_404(StoryComment, pk=self.kwargs['pk'])
        if comment.author != self.request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return comment

class ParentSettingsUpdateView(RetrieveUpdateAPIView):
    serializer_class = ParentSettingsSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        parent = get_object_or_404(Parent, user=self.request.user)
        settings = get_object_or_404(ParentSettings, parent=parent)
        return settings

class ChatGroupCreateView(CreateAPIView):
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        serializer.save(group_owner=self.request.user)

class ChatGroupAddMembersView(ListCreateAPIView):
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        # check user is owner of the chat
        group = get_object_or_404(ChatGroup, pk=self.kwargs['pk'])
        if group.group_owner != self.request.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
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

class ChatGroupDeleteMemberView(RetrieveDestroyAPIView):
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_object(self):
        member = get_object_or_404(GroupMember, pk=self.kwargs['pk'])
        # check user is either the member or the group owner
        authorized = False
        if member.user == self.request.user:
            authorized = True
        if member.group.group_owner == self.request.user:
            authorized = True
        if authorized == False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return member 

class ChatGroupMembersList(ListAPIView):
    serializer_class = GroupMemberSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        group = get_object_or_404(ChatGroup, pk=self.kwargs['pk'])
        # check user is member of group
        get_object_or_404(GroupMember, group=group, user=self.request.user)
        return GroupMember.objects.filter(group=group)

class MessageCreateView(CreateAPIView):
    serializer_class = MessageCreateSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def perform_create(self, serializer):
        # check user is member of group
        group = get_object_or_404(ChatGroup, pk=self.request.data['group'])
        member = get_object_or_404(GroupMember, group=group, user=self.request.user)

        serializer.save(sender=member)

class ChatGroupMessageList(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get_queryset(self):
        group = get_object_or_404(ChatGroup, pk=self.kwargs['pk'])
        # check user is member of group
        get_object_or_404(GroupMember, group=group, user=self.request.user)
        return Message.objects.filter(group=group)