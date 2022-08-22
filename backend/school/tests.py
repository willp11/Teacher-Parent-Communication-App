from django.urls import reverse
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from .serializers import *
from .model_factories import *
import json

class SchoolTests(APITestCase):
    user = None
    token = None
    school = None
    teacher = None

    def setUp(self):
        # clear the User table
        CustomUser.objects.all().delete()
        # create new user
        self.user = CustomUser.objects.create_user('test_user_1', 'test@abc.com', 'test')
        self.user.email_verified = True
        self.user.save()
        # get an auth token
        url = reverse('rest_login')
        response = self.client.post(url, {"email": self.user.email, "password": "test"}, format="json")
        token = response.data["key"]
        self.token = token
        # set the client auth config
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        # create school
        self.school = SchoolFactory.create()
        # create teacher
        self.teacher = TeacherFactory.create(user=self.user, school=self.school)

    # Test POST /api/v1/school/class-create/
    def test_schoolClassCreate(self):
        url = reverse('class_create')
        data = {"name": "Grade 6"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # check db instance has been saved
        self.assertEqual(SchoolClass.objects.filter(school=self.teacher.school, teacher=self.teacher, name="Grade 6").count(), 1)