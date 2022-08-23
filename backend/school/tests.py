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
    school_class = None
    announcement = None
    assignment = None
    student = None
    assignee = None

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
        # create class
        self.school_class = SchoolClassFactory.create(teacher=self.teacher, school=self.school)
        # create announcement
        self.announcement = AnnouncementFactory.create(school_class=self.school_class)
        # create assignment
        self.assignment = AssignmentFactory.create(school_class=self.school_class)
        # create student
        self.student = StudentFactory.create(school_class=self.school_class)
        # create assignee
        self.assignee = AssigneeFactory(assignment=self.assignment, student=self.student)

    # All endpoints prefixed by /api/v1/school/
    # GET requests, check status code and correct data is returned
    # POST, PUT requests, check status code and instance has been saved
    # DELETE requests, check status code and instance has been deleted

    # POST announcement-create/
    def test_announcementCreate(self):
        url = reverse('announcement_create')
        data = {"title": "new announcement", "content": "an announcement", "school_class": self.school_class.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Announcement.objects.filter(title="new announcement", content="an announcement", school_class=self.school_class).count(), 1)

    # PUT announcement-update/<int:pk>/
    def test_announcementUpdate(self):
        url = reverse('announcement_update', kwargs={'pk': self.announcement.pk})
        data = {"title": "updated announcement", "content": "..."}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Announcement.objects.filter(pk=self.announcement.pk, title="updated announcement", content="...", school_class=self.school_class).count(), 1)

    # DELETE announcement-delete/<int:pk>/
    def test_announcementDelete(self):
        url = reverse('announcement_delete', kwargs={'pk': self.announcement.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Announcement.objects.filter(pk=self.announcement.pk).count(), 0)

    # POST assignment-create/
    def test_assignmentCreate(self):
        url = reverse('assignment_create')
        data = {"title": "new assignment", "description": "an assignment", "maximum_score": 10, "response_format": "Text", "school_class": self.school_class.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Assignment.objects.filter(title="new assignment", description="an assignment", maximum_score=10, response_format="Text", school_class=self.school_class).count(), 1)

    # PUT assignment-update/<int:pk>/
    def test_assignmentUpdate(self):
        url = reverse('assignment_update', kwargs={'pk': self.assignment.pk})
        data = {"title": "updated assignment", "description": "...", "maximum_score": 12, "response_format": "Image"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Assignment.objects.filter(pk=self.assignment.pk, title="updated assignment", description="...", maximum_score=12, response_format="Image", school_class=self.school_class).count(), 1)

    # DELETE assignment-delete/<int:pk>/
    def test_assignmentDelete(self):
        url = reverse('assignment_delete', kwargs={'pk': self.assignment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Assignment.objects.filter(pk=self.assignment.pk).count(), 0)

    # POST assignee-create/<int:pk>/ # Test client doesn't accept data as array (whereas real client does)
    # def test_assigneeCreate(self):
    #     url = reverse('assignment_delete', kwargs={'pk': self.assignment.pk})
    #     data = [{"assignment": self.assignment.pk, "student": self.student.pk}]
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, 201)
    #     self.assertEqual(Assignee.objects.filter(assignment=self.assignment.pk, student=self.student.pk).count(), 1)

    # PUT assignee-score-update/<int:pk>/
    def test_assigneeScoreUpdate(self):
        url = reverse('assignee_score_update', kwargs={'pk': self.assignee.pk})
        data = {"score": 5, "feedback": "needs work"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Assignee.objects.filter(pk=self.assignee.pk, score=5, feedback="needs work").count(), 1)

    # GET assignee-list/<int:pk>/
    def test_assigneeList(self):
        url = reverse('assignee_list', kwargs={'pk': self.assignment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        # {'id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses'}
        self.assertTrue('id' in data[0])
        self.assertTrue('student' in data[0])
        self.assertTrue('feedback' in data[0])
        self.assertTrue('score' in data[0])
        self.assertTrue('submitted' in data[0])
        self.assertTrue('assignment_responses' in data[0])
        self.assertEqual(data[0]['id'], self.assignee.id)
        self.assertEqual(data[0]['student']['name'], self.assignee.student.name)
        self.assertEqual(data[0]['feedback'], self.assignee.feedback)
        self.assertEqual(data[0]['score'], self.assignee.score)
        self.assertEqual(data[0]['submitted'], self.assignee.submitted)
        self.assertEqual(data[0]['assignment_responses'], [])

    # GET assignment-detail/<code>/
    def test_assignmentDetail(self):
        url = reverse('assignment_detail',  kwargs={'code': self.assignment.code})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        # {'title', 'description', 'maximum_score', 'response_format', 'assigned_students': [{'id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses'}] }
        self.assertTrue('title' in data)
        self.assertTrue('description' in data)
        self.assertTrue('maximum_score' in data)
        self.assertTrue('response_format' in data)
        self.assertTrue('assigned_students' in data)
        self.assertTrue('id' in data['assigned_students'][0])
        self.assertTrue('student' in data['assigned_students'][0])
        self.assertTrue('feedback' in data['assigned_students'][0])
        self.assertTrue('score' in data['assigned_students'][0])
        self.assertTrue('submitted' in data['assigned_students'][0])
        self.assertTrue('assignment_responses' in data['assigned_students'][0])
        self.assertEqual(data['title'], self.assignment.title)
        self.assertEqual(data['description'], self.assignment.description)
        self.assertEqual(data['maximum_score'], self.assignment.maximum_score)
        self.assertEqual(data['response_format'], self.assignment.response_format)
        self.assertEqual(data['assigned_students'][0]['id'], self.assignee.id)
        self.assertEqual(data['assigned_students'][0]['student']['name'], self.assignee.student.name)
        self.assertEqual(data['assigned_students'][0]['feedback'], self.assignee.feedback)
        self.assertEqual(data['assigned_students'][0]['score'], self.assignee.score)
        self.assertEqual(data['assigned_students'][0]['submitted'], self.assignee.submitted)
        self.assertEqual(data['assigned_students'][0]['assignment_responses'], [])

    # POST class-create/
    def test_schoolClassCreate(self):
        url = reverse('class_create')
        data = {"name": "Grade 6"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SchoolClass.objects.filter(school=self.teacher.school, teacher=self.teacher, name="Grade 6").count(), 1)
