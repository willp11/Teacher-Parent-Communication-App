from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from .models import ChatGroup, GroupMember, Student

class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if request.user.email_verified:
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
        is_owner = False
        if group.group_owner == request.user:
            return True
        # check if user is member of group
        member_queryset = GroupMember.objects.filter(user=request.user, group=group)
        if len(member_queryset) > 0:
            return True
        return False

