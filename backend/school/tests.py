from tkinter import TRUE
from django.urls import reverse
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from .serializers import *
from .model_factories import *
import json
import datetime

class SchoolTests(APITestCase):
    user = None
    token = None
    school = None
    teacher = None
    parent = None
    school_class = None
    announcement = None
    assignment = None
    student = None
    student2 = None
    invite_code = None
    assignee = None
    chat_group = None
    group_member = None
    event = None
    helper = None
    story = None

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
        # create db instances
        self.school = SchoolFactory.create()
        self.teacher = TeacherFactory.create(user=self.user, school=self.school)
        self.parent = ParentFactory.create(user=self.user)
        self.school_class = SchoolClassFactory.create(teacher=self.teacher, school=self.school)
        self.announcement = AnnouncementFactory.create(school_class=self.school_class)
        self.assignment = AssignmentFactory.create(school_class=self.school_class)
        self.student = StudentFactory.create(school_class=self.school_class, parent=self.parent)
        self.student2 = StudentFactory.create(name="student2", school_class=self.school_class, parent=self.parent)
        self.invite_code = InviteCodeFactory.create(student=self.student2)
        self.assignee = AssigneeFactory.create(assignment=self.assignment, student=self.student)
        self.chat_group = ChatGroupFactory.create(group_owner=self.user)
        self.group_member = GroupMemberFactory.create(user=self.user, group=self.chat_group)
        self.message = MessageFactory.create(sender=self.group_member, group=self.chat_group)
        self.event = EventFactory.create(school_class=self.school_class)
        self.helper = HelperFactory.create(parent=self.parent, event=self.event)
        self.parentSettings = ParentSettingsFactory.create(parent=self.parent)
        self.story = StoryFactory.create(school_class=self.school_class)
        self.storyComment = StoryCommentFactory.create(author=self.user, story=self.story)

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
    # {'id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses'}
    def test_assigneeList(self):
        url = reverse('assignee_list', kwargs={'pk': self.assignment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
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
    # {'title', 'description', 'maximum_score', 'response_format', 'assigned_students': [{'id', 'student', 'feedback', 'score', 'submitted', 'assignment_responses'}] }
    def test_assignmentDetail(self):
        url = reverse('assignment_detail',  kwargs={'code': self.assignment.code})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
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

    # GET chat-group-get/<int:pk>/
    # {'id', 'name', 'direct_message', 
    # 'recipient': {'id', 'first_name', 'last_name'}, 
    # 'group_owner': {'id', 'first_name', 'last_name'}, 
    # 'chat_members': ['user',], 
    # 'chat_messages': [{'sender': {'user'}, 'group', 'content', 'time'}]}
    def test_chatGroupGet(self):
        url = reverse('chat_group_get', kwargs={'pk': self.chat_group.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('id' in data)
        self.assertTrue('name' in data)
        self.assertTrue('direct_message' in data)
        self.assertTrue('recipient' in data)
        self.assertTrue('group_owner' in data)
        self.assertTrue('chat_members' in data)
        self.assertTrue('chat_messages' in data)
        self.assertTrue('user' in data['chat_members'][0])
        self.assertTrue('sender' in data['chat_messages'][0])
        self.assertTrue('group' in data['chat_messages'][0])
        self.assertTrue('content' in data['chat_messages'][0])
        self.assertTrue('time' in data['chat_messages'][0])
        self.assertEqual(data['id'], self.chat_group.id)
        self.assertEqual(data['name'], self.chat_group.name)
        self.assertEqual(data['direct_message'], self.chat_group.direct_message)
        self.assertEqual(data['recipient'], self.chat_group.recipient)
        self.assertEqual(data['group_owner']['id'], self.chat_group.group_owner.id)
        self.assertEqual(data['chat_members'][0]['user']['id'], self.group_member.user.id)
        self.assertEqual(data['chat_messages'][0]['sender']['user']['id'], self.message.sender.user.id)
        self.assertEqual(data['chat_messages'][0]['group'], self.message.group.id)
        self.assertEqual(data['chat_messages'][0]['content'], self.message.content)

    # POST chat-group-add-members/<int:pk>/ - can't test due to list issue

    # GET chat-group-user-get/
    # {'chat_group_member': [{'user': {'first_name': 'last_name'}, 'group': {'id'}, 'connected_to_call', 'connected_to_chat'}]}
    def test_chatGroupUserGet(self):
        url = reverse('chat_group_user_get')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('chat_group_member' in data)
        self.assertTrue('user' in data['chat_group_member'][0])
        self.assertTrue('first_name' in data['chat_group_member'][0]['user'])
        self.assertTrue('last_name' in data['chat_group_member'][0]['user'])
        self.assertTrue('group' in data['chat_group_member'][0])
        self.assertTrue('id' in data['chat_group_member'][0]['group'])
        self.assertTrue('connected_to_call' in data['chat_group_member'][0])
        self.assertTrue('connected_to_chat' in data['chat_group_member'][0])
        self.assertEqual(data['chat_group_member'][0]['user']['first_name'], self.group_member.user.first_name)
        self.assertEqual(data['chat_group_member'][0]['user']['last_name'], self.group_member.user.last_name)
        self.assertEqual(data['chat_group_member'][0]['group']['id'], self.group_member.group.id)
        self.assertEqual(data['chat_group_member'][0]['connected_to_call'], self.group_member.connected_to_call)
        self.assertEqual(data['chat_group_member'][0]['connected_to_chat'], self.group_member.connected_to_chat)

    # POST chat-group-create/
    # creates both group and group member instances
    def test_chatGroupCreate(self):
        url = reverse('chat_group_create')
        data = {'name': 'Test group'}
        response = self.client.post(url, data)
        res_data = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ChatGroup.objects.filter(id=res_data['id']).count(), 1)
        self.assertEqual(GroupMember.objects.filter(user=self.user, group=res_data['id']).count(), 1)

    # POST chat-group-create-direct/
    def test_chatGroupCreateDirect(self):
        url = reverse('chat_group_create')
        data = {'name': 'Test group', 'direct': True}
        response = self.client.post(url, data)
        res_data = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ChatGroup.objects.filter(id=res_data['id']).count(), 1)
        self.assertEqual(GroupMember.objects.filter(user=self.user, group=res_data['id']).count(), 1)

    # POST class-create/
    def test_schoolClassCreate(self):
        url = reverse('class_create')
        data = {"name": "Grade 6"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SchoolClass.objects.filter(school=self.teacher.school, teacher=self.teacher, name="Grade 6").count(), 1)

    # POST event-create/
    def test_eventCreate(self):
        url = reverse('event_create')
        today = datetime.date.today()
        data = {"name": "new event", "date": today, "description": "an event", "school_class": self.school_class.pk, "helpers_required": 2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Event.objects.filter(name="new event", description="an event", school_class=self.school_class, helpers_required=2).count(), 1)

    # PUT event-update/<int:pk>/
    def test_eventUpdate(self):
        url = reverse('event_update', kwargs={'pk': self.event.pk})
        today = datetime.date.today()
        data = {"name": "new event!!", "date": today, "description": "an event!!", "helpers_required": 3}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Event.objects.filter(name="new event!!", description="an event!!", helpers_required=3, school_class=self.school_class).count(), 1)

    # DELETE event-delete/<int:pk>/
    def test_eventDelete(self):
        url = reverse('event_delete', kwargs={'pk': self.event.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Event.objects.filter(pk=self.event.pk).count(), 0)

    # POST helper-create/
    def test_helperCreate(self):
        url = reverse('helper_create')
        data = {'event': self.event.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Helper.objects.filter(parent=self.parent.id, event=self.event).count(), 1)

    # DELETE helper-delete/<int:pk>/
    def test_helperDelete(self):
        url = reverse('helper_delete', kwargs={'pk': self.event.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Helper.objects.filter(event=self.event.pk).count(), 0)

    # GET, POST school-list-create/ and PUT teacher-school-update/
    def test_schoolListCreate(self):
        url = reverse('school_create')
        # GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('id' in data[0])
        self.assertTrue('name' in data[0])
        self.assertTrue('country' in data[0])
        self.assertTrue('city' in data[0])
        # POST
        data = {'name': 'Test School 2', 'country': 'UK', 'city': 'Manchester'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(School.objects.filter(name='Test School 2', country='UK', city='Manchester').count(), 1)
        
        # Change school to the new school
        url = reverse('teacher_school_update')
        school = School.objects.filter(name='Test School 2', country='UK', city='Manchester')[0]
        data = {'school': school.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        teacher = Teacher.objects.get(user=self.user)
        self.assertEqual(teacher.school.pk, school.pk)

    # PUT use-invite-code/
    def test_useInviteCode(self):
        url = reverse('use_invite_code')
        data = {'code': self.invite_code.code}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Student.objects.filter(name="student2", parent=self.parent).count(), 1)

    # PUT parent-settings-update/
    def test_parentSettingsUpdate(self):
        url = reverse('parent_settings_update')
        data = {'notification_mode': 'App', 'message_received_notification': True, 'new_story_notification': True, 'new_announcement_notification': True, 'new_event_notification': True}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ParentSettings.objects.filter(parent=self.parent, notification_mode='App', message_received_notification=True, new_story_notification=True, new_announcement_notification=True, new_event_notification=True).count(), 1)

    
    # POST story-create/
    def test_storyCreate(self):
        url = reverse('story_create')
        data = {'title': 'A new story', 'content': 'A new story content', 'school_class': self.school_class.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Story.objects.filter(title='A new story', content='A new story content', school_class=self.school_class).count(), 1)

    # PUT story-update/<int:pk>/
    def test_storyUpdate(self):
        url = reverse('story_update', kwargs={'pk': self.story.pk})
        data = {'title': 'A new story!!', 'content': 'A new story content!!'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Story.objects.filter(title='A new story!!', content='A new story content!!', school_class=self.school_class).count(), 1)

    # DELETE story-delete/<int:pk>/
    def test_storyDelete(self):
        url = reverse('story_delete', kwargs={'pk': self.story.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Story.objects.filter(pk=self.story.pk).count(), 0)

    # GET story-comment-list/<int:pk>/
    # [{'id', 
    # 'author':{'id','first_name','last_name'}, 
    # 'content', 
    # 'created_at', 
    # 'updated_at', 
    # 'story'}]
    def test_storyCommentList(self):
        url = reverse('story_comment_list', kwargs={'pk': self.story.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('id' in data[0])
        self.assertTrue('author' in data[0])
        self.assertTrue('content' in data[0])
        self.assertTrue('created_at' in data[0])
        self.assertTrue('updated_at' in data[0])
        self.assertTrue('story' in data[0])
        self.assertEqual(data[0]['id'], self.storyComment.id)
        self.assertEqual(data[0]['author']['id'], self.user.id)
        self.assertEqual(data[0]['content'], self.storyComment.content)
        self.assertEqual(data[0]['story'], self.storyComment.story.pk)

    # POST story-comment-create/
    def test_storyCommentCreate(self):
        url = reverse('story_comment_create')
        data = {'content': 'wow looks good', 'story': self.story.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StoryComment.objects.filter(content='wow looks good', story=self.story).count(), 1)

    # POST student-create/
    def test_studentCreate(self):
        url = reverse('student_create')
        data = {'name': 'Billy', 'school_class': self.school_class.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Student.objects.filter(name="Billy", school_class=self.school_class.pk).count(), 1)

    # PUT student-update/<int:pk>/
    def test_studentUpdate(self):
        url = reverse('student_update', kwargs={'pk': self.student.pk})
        data = {'name': 'Barry'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Student.objects.filter(pk=self.student.pk, name='Barry').count(), 1)

    # DELETE student-delete/<int:pk>/
    def test_studentDelete(self):
        url = reverse('student_delete', kwargs={'pk': self.student.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Student.objects.filter(pk=self.student.pk).count(), 0)

    # GET student-portfolio-list/<int:pk>/
    # portfolio: name, parent, school_class, portfolio: [{assignment, assignment_responses: []}], stickers: [], invite_code: {code}
    def test_studentPortfolioGet(self):
        url = reverse('student_portfolio_list', kwargs={'pk': self.student.pk})
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertTrue('name' in data)
        self.assertTrue('parent' in data)
        self.assertTrue('school_class' in data)
        self.assertTrue('portfolio' in data)
        self.assertTrue('stickers' in data)
        self.assertTrue('invite_code' in data)

    # GET teacher-contacts-get/
    # {school_classes: [
    #   {'id', 
    #   'name', 
    #   'students': [{'name', 'parent': {user: {first_name, last_name}} }]
    # ]}
    def test_teacherContactsGet(self):
        url = reverse('teacher_contacts_get')
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertTrue('school_classes' in data)
        self.assertTrue('id' in data['school_classes'][0])
        self.assertTrue('name' in data['school_classes'][0])
        self.assertTrue('students' in data['school_classes'][0])
        self.assertTrue('name' in data['school_classes'][0]['students'][0])
        self.assertTrue('parent' in data['school_classes'][0]['students'][0])
        self.assertTrue('user' in data['school_classes'][0]['students'][0]['parent'])
        self.assertTrue('first_name' in data['school_classes'][0]['students'][0]['parent']['user'])
        self.assertTrue('last_name' in data['school_classes'][0]['students'][0]['parent']['user'])

    # GET parent-contacts-get/
    # {'id', '
    # 'children': [
    #   {'id', 
    #   'name', 
    #   'school_class': 
    #       {'id', 
    #       'name', 
#           'teacher': {user: {first_name, last_name}}, 
#           'students': [{'name', 'parent': {user: {first_name, last_name}}}], 
    #   }
    # ]}
    def test_parentContactsGet(self):
        url = reverse('parent_contacts_get')
        response = self.client.get(url)
        data = json.loads(response.content)
        self.assertTrue('id' in data)
        self.assertTrue('children' in data)
        self.assertTrue('id' in data['children'][0])
        self.assertTrue('name' in data['children'][0])
        self.assertTrue('school_class' in data['children'][0])
        self.assertTrue('id' in data['children'][0]['school_class'])
        self.assertTrue('name' in data['children'][0]['school_class'])
        self.assertTrue('teacher' in data['children'][0]['school_class'])
        self.assertTrue('students' in data['children'][0]['school_class'])
        self.assertTrue('name' in data['children'][0]['school_class']['students'][0])
        self.assertTrue('parent' in data['children'][0]['school_class']['students'][0])
        self.assertTrue('user' in data['children'][0]['school_class']['students'][0]['parent'])
        self.assertTrue('first_name' in data['children'][0]['school_class']['students'][0]['parent']['user'])
        self.assertTrue('last_name' in data['children'][0]['school_class']['students'][0]['parent']['user'])

    # POST parent-create/ (at end as need account that doesn't already have a parent instance relation)
    def test_parentCreate(self):
        # create new user
        user = CustomUser.objects.create_user('test_user_2', 'test2@abc.com', 'test2')
        user.email_verified = True
        user.save()
        # login
        url = reverse('rest_login')
        response = self.client.post(url, {"email": user.email, "password": "test2"}, format="json")
        # create parent
        url = reverse('parent_create')
        data = {'user': user.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Parent.objects.filter(user=user).count(), 1)
        # logout
        self.client.post(reverse('rest_logout'))

    # POST teacher-create/
    def test_teacherCreate(self):
        # create new user
        user = CustomUser.objects.create_user('test_user_2', 'test2@abc.com', 'test2')
        user.email_verified = True
        user.save()
        # login
        url = reverse('rest_login')
        response = self.client.post(url, {"email": user.email, "password": "test2"}, format="json")
        # create teacher
        url = reverse('teacher_create')
        data = {'user': user.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Teacher.objects.filter(user=user).count(), 1)
        # logout
        self.client.post(reverse('rest_logout'))
