from rest_framework import serializers
from .models import CustomUser
from school.serializers import TeacherSerializer, ParentSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from .forms import CustomAllAuthPasswordResetForm

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password')

class UserProfileSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer()
    parent = ParentSerializer()

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'email_verified', 'teacher', 'parent')

class CustomPasswordResetSerializer(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return CustomAllAuthPasswordResetForm
