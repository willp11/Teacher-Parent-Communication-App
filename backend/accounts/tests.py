from django.urls import reverse
from rest_framework.test import APITestCase
from .models import CustomUser
from .serializers import *
import json

class UserApiViewsetTests(APITestCase):
    user = None
    token = None

    def setUp(self):
        # clear the User table
        CustomUser.objects.all().delete()
        # create new user
        self.user = CustomUser.objects.create_user('test_user_1', 'test@abc.com', 'test')

        # get an auth token
        url = reverse('rest_login')
        response = self.client.post(url, {"email": self.user.email, "password": "test"}, format="json")
        token = response.data["key"]
        self.token = token
        # set the client auth config
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

    # Test the GET 'dj-rest-auth/user/' endpoint returns status code 200, correct fields and data content of fields are correct
    def test_getUserProfile(self):
        url = reverse('rest_user_details')
        response = self.client.get(url)
        response.render()
        # check response status code
        self.assertEqual(response.status_code, 200)
        # check the data
        data = json.loads(response.content)
        # has correct fields
        self.assertTrue('pk' in data)
        self.assertTrue('email' in data)
        self.assertTrue('username' in data)
        self.assertTrue('email_verified' in data)
        # fields have correct values
        self.assertEqual(data['pk'], self.user.pk)
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['email_verified'], self.user.email_verified)