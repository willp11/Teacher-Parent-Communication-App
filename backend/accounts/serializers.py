from rest_framework import serializers
from .models import CustomUser
from school.serializers import TeacherSerializer, ParentSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=True) # we get error if not put many=True, although there aren't many
    parent = ParentSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ('pk', 'email', 'username', 'email_verified', 'teacher', 'parent')
