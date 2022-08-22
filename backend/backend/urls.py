"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from dj_rest_auth.registration.views import VerifyEmailView, ConfirmEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from django.contrib.auth.views import PasswordChangeView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('allauth.urls')),
    path('api/v1/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/v1/dj-rest-auth/registration/account-confirm-email/<str:key>/', ConfirmEmailView.as_view(), name='account_confirm_email'), # Needs to be defined before the registration path
    path('api/v1/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/v1/dj-rest-auth/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    path('api/v1/dj-rest-auth/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/v1/dj-rest-auth/password/reset/confirm/<str:uid>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/v1/dj-rest-auth/password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('api/v1/school/', include('school.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
