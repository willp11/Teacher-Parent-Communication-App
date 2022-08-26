from django.urls import path
from .views import *

urlpatterns = [
    # ANNOUNCEMENTS
    path('announcement-create/', AnnouncementCreateView.as_view(), name='announcement_create'), # create new announcement
    path('announcement-update/<int:pk>/', AnnouncementUpdateView.as_view(), name='announcement_update'), # edit announcement
    path('announcement-delete/<int:pk>/', AnnouncementDeleteView.as_view(), name='announcement_delete'), # delete announcement

    # ASSIGNMENTS
    path('assignment-create/', AssignmentCreateView.as_view(), name='assignment_create'), # create new assignment
    path('assignment-update/<int:pk>/', AssignmentUpdateView.as_view(), name='assignment_update'), # edit assignment
    path('assignment-delete/<int:pk>/', AssignmentDeleteView.as_view(), name='assignment_delete'), # delete assignment
    path('assignee-create/<int:pk>/', AssigneeCreateView.as_view(), name='assignee_create'), # assign students to assignment
    path('assignee-delete-list/<int:pk>/', AssigneeDeleteListView.as_view(), name='assignee_delete_list'), # delete students from assignment
    path('assignee-score-update/<int:pk>/', AssigneeScoreUpdateView.as_view(), name='assignee_score_update'), # update a student's score/feedback
    path('assignee-list/<int:pk>/', AssigneeListView.as_view(), name='assignee_list'), # get list of all assigned students
    path('assignment-detail/<code>/', AssignmentDetailView.as_view(), name='assignment_detail'), # get all assignment info (used on submit assignment page)
    path('assignment-response-create/', AssignmentResponseCreateView.as_view(), name='assignment_response_create'), # student submits their assignment

    # CHAT GROUPS
    path('chat-group-get/<int:pk>/', ChatGroupGetView.as_view(), name='chat_group_get'), # get all data for the chat group
    path('chat-group-add-members/<int:pk>/', ChatGroupAddMembersView.as_view(), name='chat_group_add_members'), # add members to the group
    path('chat-group-user-get/', ChatGroupUserGetView.as_view(), name='chat_group_user_get'), # get all chat groups user is a member of
    path('chat-group-create/', ChatGroupCreateView.as_view(), name='chat_group_create'), # create new chat group
    path('chat-group-create-direct/', ChatGroupDirectCreateView.as_view(), name='chat_group_create_direct'), # create new direct message chat group
    path('chat-group-members-list/<int:pk>/', ChatGroupMembersListView.as_view(), name='chat_group_members_list'), # get all group members (called inside hooks/useGroupMembers)
    # path('chat-group-delete-member/<int:pk>/', ChatGroupDeleteMemberView.as_view(), name='chat_group_delete_member'), # no delete functionality implemented on frontend
    
    # EVENTS
    path('event-create/', EventCreateView.as_view(), name='event_create'), # create new event
    path('event-update/<int:pk>/', EventUpdateView.as_view(), name='event_update'), # edit event
    path('event-delete/<int:pk>/', EventDeleteView.as_view(), name='event_delete'), # delete event
    path('helper-create/', HelperCreateView.as_view(), name='helper_create'), # parent register as helper for event
    path('helper-delete/<int:pk>/', HelperDeleteView.as_view(), name='helper_delete'), # parent unregister as helper for event

    # NOTIFICATIONS
    path('notifications-get/', UnreadNotificationsGetView.as_view(), name='notifications_get'), # get all user's unread notifications
    path('chat-notification-update/<int:pk>/', ChatNotificationUpdateView.as_view(), name='chat_notification_update'), # update a single chat notification
    path('class-notification-update/<int:pk>/', ClassNotificationUpdateView.as_view(), name='class_notification_update'), # update a single school class notification
    path('all-notifications-update/', AllNotificationUpdateView.as_view(), name='all_notifications_update'), # update all notifications read=True

    # PROFILE PAGE
    path('parent-create/', ParentCreateView.as_view(), name='parent_create'), # select parent account type
    path('teacher-create/', TeacherCreateView.as_view(), name='teacher_create'), # select teacher account type
    path('profile-upload/', ProfilePictureUpdateView.as_view(), name='profile_upload'), # upload profile picture
    path('school-list-create/', SchoolCreateView.as_view(), name='school_create'), # get all schools and add new school to list
    path('teacher-school-update/', TeacherSchoolUpdateView.as_view(), name='teacher_school_update'), # update teacher's school
    path('class-create/', ClassCreateView.as_view(), name='class_create'), # teacher account create a new school class
    path('use-invite-code/', InviteCodeUseView.as_view(), name='use_invite_code'), # add child to parent account by using child's invite code
    path('parent-settings-update/', ParentSettingsUpdateView.as_view(), name='parent_settings_update'), # update parent account's settings
    path('settings-update/', SettingsUpdateView.as_view(), name='settings_update'), # update parent account's settings

    # SCHOOL CLASS PAGE
    path('class/<int:pk>/', ClassDetailView.as_view(), name='class_detail'), # get all data for a school class

    # STORIES
    path('story-create/', StoryCreateView.as_view(), name='story_create'), # create a new story
    path('story-update/<int:pk>/', StoryUpdateView.as_view(), name='story_update'), # edit story
    path('story-delete/<int:pk>/', StoryDeleteView.as_view(), name='story_delete'), # delete story
    path('story-media-create/', StoryMediaCreateView.as_view(), name='story_media_create'), # upload story images
    path('story-comment-list/<int:pk>/', StoryCommentListView.as_view(), name='story_comment_list'), # get all comments for a story
    path('story-comment-create/', StoryCommentCreateView.as_view(), name='story_comment_create'), # create a new comment
    # path('story-comment-update/<int:pk>/', StoryCommentUpdateView.as_view(), name='story_comment_update'), # no edit comment functionality implemented on frontend

    # STUDENTS
    path('student-create/', StudentCreateView.as_view(), name='student_create'), # create new student
    path('student-delete/<int:pk>/', StudentDeleteView.as_view(), name='student_delete'), # delete student
    path('student-update/<int:pk>/', StudentNameUpdateView.as_view(), name='student_update'), # edit student's name
    path('student-image-upload/<int:pk>/', StudentImageUpdateView.as_view(), name='student_image_upload'), # upload student profile picture
    path('sticker-create/', StickerCreateView.as_view(), name='sticker_create'), # award a sticker to a student
    
    # STUDENT PORTFOLIO
    path('student-portfolio-list/<int:pk>/', StudentPortfolioGetView.as_view(), name='student_portfolio_list'), # get student's portfolio of assignments

    # CONTACTS - hooks/useContacts
    path('teacher-contacts-get/', TeacherContactsGetListView.as_view(), name='teacher_contacts_get'), # get all a teacher account's contacts
    path('parent-contacts-get/', ParentContactsGetListView.as_view(), name='parent_contacts_get'), # get all a parent account's contacts
]