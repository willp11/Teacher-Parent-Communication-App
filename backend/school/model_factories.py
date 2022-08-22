from ast import Store
import factory
from .models import *

class SchoolFactory(factory.django.DjangoModelFactory):
    name = "Test School"
    city = "London"
    country = "UK"

    class Meta:
        model = School

class TeacherFactory(factory.django.DjangoModelFactory):
    school = factory.SubFactory(SchoolFactory)

    class Meta:
        model = Teacher