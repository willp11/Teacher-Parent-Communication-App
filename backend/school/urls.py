from django.urls import path
from .views import *

urlpatterns = [
    path('portfolio/<int:pk>/', PortfolioList.as_view(), name='portfolio')
]