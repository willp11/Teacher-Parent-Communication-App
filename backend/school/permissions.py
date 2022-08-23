from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from .models import *

class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if request.user.email_verified:
            return True
        return False

class IsClassTeacher(BasePermission):
    def has_permission(self, request, view):
        teacher = get_object_or_404(Teacher, user=request.user)
        view_name = view.get_view_name()
        if view_name == "Announcement Update" or view_name == "Announcement Delete":
            announcement = get_object_or_404(Announcement, pk=view.kwargs['pk'])
            school_class = get_object_or_404(SchoolClass, pk=announcement.school_class.pk)
        elif view_name == "Assignment Update" or view_name == "Assignment Delete" or view_name == "Assignee Create" or view_name == "Assignee Delete List":
            assignment = get_object_or_404(Assignment, pk=view.kwargs['pk'])
            school_class = get_object_or_404(SchoolClass, pk=assignment.school_class.pk)
        elif view_name == "Event Update" or view_name == "Event Delete":
            event = get_object_or_404(Event, pk=view.kwargs['pk'])
            school_class = get_object_or_404(SchoolClass, pk=event.school_class.pk)
        elif view_name == "Story Update" or view_name == "Story Delete":
            story = get_object_or_404(Story, pk=view.kwargs['pk'])
            school_class = get_object_or_404(SchoolClass, pk=story.school_class.pk)
        elif view_name == "Student Update" or view_name == "Student Delete":
            student = get_object_or_404(Student, pk=view.kwargs['pk'])
            school_class = get_object_or_404(SchoolClass, pk=student.school_class.pk)
        elif view_name == "Announcement Create" or view_name == "Assignment Create" or view_name == "Event Create" or view_name == "Story Create":
            school_class = get_object_or_404(SchoolClass, pk=request.data['school_class'], teacher=teacher)

        if school_class.teacher == teacher:
            return True
        return False

class IsAssignmentCreator(BasePermission):
    def has_permission(self, request, view):
        teacher = get_object_or_404(Teacher, user=request.user)
        assignee = get_object_or_404(Assignee, pk=view.kwargs['pk'])
        assignment = get_object_or_404(Assignment, pk=assignee.assignment.pk)

        if assignment.school_class.teacher == teacher:
            return True
        return False

class IsStudentParentOrTeacher(BasePermission):
    def has_permission(self, request, view):
        student = get_object_or_404(Student, pk=view.kwargs['pk'])
        # check user is either teacher or parent
        user_is_parent = False
        user_is_teacher = False
        if student.school_class.teacher.user == request.user:
            user_is_teacher = True
        if student.parent != None:
            if student.parent.user == request.user:
                user_is_parent = True
        if user_is_parent == True or user_is_teacher == True:
            return True
        return False

class IsChatOwner(BasePermission):
    def has_permission(self, request, view):
        group = get_object_or_404(ChatGroup, pk=view.kwargs['pk'])
        if group.group_owner == request.user:
            return True
        return False

class IsChatOwnerOrMember(BasePermission):
    def has_permission(self, request, view):
        group = get_object_or_404(ChatGroup, pk=view.kwargs['pk'])
        # check if user is owner of group
        if group.group_owner == request.user:
            return True
        # check if user is member of group
        member_queryset = GroupMember.objects.filter(user=request.user, group=group)
        if len(member_queryset) > 0:
            return True
        return False

