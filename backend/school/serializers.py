from rest_framework import serializers
from .models import *

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    school = SchoolSerializer()
    class Meta:
        model = Teacher
        fields = '__all__'

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'