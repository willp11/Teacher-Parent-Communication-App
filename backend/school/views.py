from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *

class PortfolioListView(ListAPIView):
    serializer_class = AssigneeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs['student']
        student = get_object_or_404(Student, pk=student_id)
        return Assignee.objects.filter(student=student, in_portfolio=True)

class ClassDetailView(RetrieveAPIView):
    serializer_class = ClassDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        class_id = self.kwargs['pk']
        return get_object_or_404(SchoolClass, pk=class_id)

class ClassCreateView(CreateAPIView):
    serializer_class = ClassCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        serializer.save(teacher=teacher)

class StudentCreateView(CreateAPIView):
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class AnnouncementCreateView(CreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class EventCreateView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class StoryCreateView(CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class StoryMediaCreateView(CreateAPIView):
    serializer_class = StoryMediaSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # user must be a teacher
        teacher = get_object_or_404(Teacher, user=self.request.user)
        # user must be teacher of this class
        school_class = get_object_or_404(SchoolClass, pk=self.request.POST['school_class'][0], teacher=teacher)
        serializer.save(school_class=school_class)

class AssigneeCreateView(ListCreateAPIView):
    serializer_class = AssigneeCreateSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # check user is teacher of the class
        teacher = get_object_or_404(Teacher, user=self.request.user)
        assignee = get_object_or_404(Assignee, pk=self.kwargs['pk'])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)
        if assignment.school_class.teacher != teacher:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return assignee