from rest_framework import serializers
from .models import CustomUser
from school.serializers import TeacherSerializer, ParentSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer()
    parent = ParentSerializer()

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'email_verified', 'teacher', 'parent')
