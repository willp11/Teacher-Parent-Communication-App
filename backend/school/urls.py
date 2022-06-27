from django.urls import path
from .views import *

urlpatterns = [
    path('portfolio/<int:student>/', PortfolioListView.as_view(), name='portfolio'),
    path('class/<int:pk>/', ClassDetailView.as_view(), name='class_detail')
]