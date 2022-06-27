from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *

class PortfolioList(ListAPIView):
    serializer_class = AssigneeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs['pk']
        student = get_object_or_404(Student, pk=student_id)
        return Assignee.objects.filter(student=student, in_portfolio=True)
