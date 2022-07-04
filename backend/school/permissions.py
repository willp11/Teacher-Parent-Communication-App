from rest_framework.permissions import BasePermission

class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if request.user.email_verified:
            return True
        return False