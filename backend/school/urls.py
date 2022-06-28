from django.urls import path
from .views import *

urlpatterns = [
    path('portfolio/<int:student>/', PortfolioListView.as_view(), name='portfolio'),
    path('class/<int:pk>/', ClassDetailView.as_view(), name='class_detail'),
    path('class-create/', ClassCreateView.as_view(), name='class_create'),
    path('student-create/', StudentCreateView.as_view(), name='student_create'),
    path('announcement-create/', AnnouncementCreateView.as_view(), name='announcement_create'),
    path('event-create/', EventCreateView.as_view(), name='event_create'),
    path('story-create/', StoryCreateView.as_view(), name='story_create'),
    path('story-media-create/', StoryMediaCreateView.as_view(), name='story_media_create'),
    path('assignment-create/', AssignmentCreateView.as_view(), name='assignment_create'),
    path('assignee-create/<int:pk>/', AssigneeCreateView.as_view(), name='assignee_create'),
    path('assignee-delete/<int:pk>/', AssigneeDeleteView.as_view(), name='assignee_create'),
    path('assignment-media-create/', AssignmentMediaCreateView.as_view(), name='assignment_media_create'),
    path('assignee-score-update/<int:pk>/', AssigneeScoreUpdateView.as_view(), name='assignee_score_update'),
    path('assignee-in-portfolio-update/<int:pk>/', AssigneeInPortfolioUpdateView.as_view(), name='assignee_in_portfolio_update')
]