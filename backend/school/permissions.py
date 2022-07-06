from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from .models import Student

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
        if user_is_parent == False and user_is_teacher == False:
            return False
        return True