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

    # Test GET 'dj-rest-auth/user/' endpoint
    def test_getUserProfile(self):
        url = reverse('rest_user_details')
        response = self.client.get(url)
        response.render()
        # check response status code
        self.assertEqual(response.status_code, 200)
        # check the data
        data = json.loads(response.content)
        # has correct fields
        self.assertTrue('id' in data)
        self.assertTrue('email' in data)
        self.assertTrue('first_name' in data)
        self.assertTrue('last_name' in data)
        self.assertTrue('email_verified' in data)
        self.assertTrue('profile_picture' in data)
        # fields have correct values
        self.assertEqual(data['id'], self.user.id)
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['first_name'], self.user.first_name)
        self.assertEqual(data['last_name'], self.user.last_name)
        self.assertEqual(data['email_verified'], self.user.email_verified)
        self.assertEqual(data['profile_picture'], None)
        