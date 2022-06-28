from django.urls import path
from .views import *

urlpatterns = [
    path('portfolio/<int:student>/', PortfolioListView.as_view(), name='portfolio'),
    path('class/<int:pk>/', ClassDetailView.as_view(), name='class_detail'),
    path('class-create/', ClassCreateView.as_view(), name='class_create'),
    path('student-create/', StudentCreateView.as_view(), name='student_create'),
    path('student-delete/<int:pk>/', StudentDeleteView.as_view(), name='student_delete'),
    path('announcement-create/', AnnouncementCreateView.as_view(), name='announcement_create'),
    path('event-create/', EventCreateView.as_view(), name='event_create'),
    path('story-create/', StoryCreateView.as_view(), name='story_create'),
    path('story-media-create/', StoryMediaCreateView.as_view(), name='story_media_create'),
    path('assignment-create/', AssignmentCreateView.as_view(), name='assignment_create'),
    path('assignee-create/<int:pk>/', AssigneeCreateView.as_view(), name='assignee_create'),
    path('assignee-delete/<int:pk>/', AssigneeDeleteView.as_view(), name='assignee_create'),
    path('assignment-media-create/', AssignmentMediaCreateView.as_view(), name='assignment_media_create'),
    path('assignee-score-update/<int:pk>/', AssigneeScoreUpdateView.as_view(), name='assignee_score_update'),
    path('assignee-in-portfolio-update/<int:pk>/', AssigneeInPortfolioUpdateView.as_view(), name='assignee_in_portfolio_update'),
    path('student-portfolio-list/<int:pk>/', StudentPortfolioGetView.as_view(), name='student_portfolio_list'),
    path('event-request-helpers/<int:pk>/', EventRequestHelpersUpdateView.as_view(), name='event_request_helpers'),
    path('helper-create/', HelperCreateView.as_view(), name='helper_create'),
    path('helper-delete/<int:pk>/', HelperDeleteView.as_view(), name='helper_delete'),
    path('story-comment-create/', StoryCommentCreateView.as_view(), name='story_comment_create'),
    path('story-comment-list/<int:pk>/', StoryCommentListView.as_view(), name='story_comment_list'),
    path('story-comment-update/<int:pk>/', StoryCommentUpdateView.as_view(), name='story_comment_update'),
    path('parent-settings-update/', ParentSettingsUpdateView.as_view(), name='parent_settings_update'),
    path('chat-group-create/', ChatGroupCreateView.as_view(), name='chat_group_create'),
    path('chat-group-add-members/<int:pk>/', ChatGroupAddMembersView.as_view(), name='chat_group_add_members'),
    path('chat-group-delete-member/<int:pk>/', ChatGroupDeleteMemberView.as_view(), name='chat_group_delete_member'),
    path('chat-message-create/', MessageCreateView.as_view(), name='chat_message_create'),
    path('chat-group-members-list/<int:pk>/', ChatGroupMembersList.as_view(), name='chat_group_members_list'),
    path('chat-group-message-list/<int:pk>/', ChatGroupMessageList.as_view(), name='chat_group_message_list')
]