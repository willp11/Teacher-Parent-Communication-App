from rest_framework import serializers
from .models import CustomUser
from school.serializers import TeacherSerializer, ParentSerializer, SettingsSerializer
from dj_rest_auth.serializers import PasswordResetSerializer, LoginSerializer
from .forms import CustomAllAuthPasswordResetForm
from dj_rest_auth.registration.serializers import RegisterSerializer

# https://stackoverflow.com/questions/36910373/django-rest-auth-allauth-registration-with-email-first-and-last-name-and-witho
class NameRegistrationSerializer(RegisterSerializer):
    username = None
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save(update_fields=['first_name', 'last_name'])

class LoginSerializerNew(LoginSerializer):
    username = None

class UserProfileSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer()
    parent = ParentSerializer()
    settings = SettingsSerializer()
    
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'email_verified', 'profile_picture', 'teacher', 'parent', 'settings')

class CustomPasswordResetSerializer(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return CustomAllAuthPasswordResetForm
