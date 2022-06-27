from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class meta(UserCreationForm):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('name',)

class CustomUserChangeForm(UserChangeForm):
    class meta(UserChangeForm):
        model = CustomUser
        fields = UserChangeForm.Meta.fields
