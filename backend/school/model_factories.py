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

class SchoolClassFactory(factory.django.DjangoModelFactory):
    teacher = factory.SubFactory(TeacherFactory)
    school = factory.SubFactory(SchoolFactory)

    class Meta:
        model = SchoolClass

class AnnouncementFactory(factory.django.DjangoModelFactory):
    title = "New announcement"
    content = "An announcement"
    school_class = factory.SubFactory(SchoolClassFactory)

    class Meta:
        model = Announcement

class AssignmentFactory(factory.django.DjangoModelFactory):
    title = "New assignment"
    description = "An assignment"
    school_class = factory.SubFactory(SchoolClassFactory)
    maximum_score = 12
    response_format = "Text"
    code = "AAAAAAAA"

    class Meta:
        model = Assignment

class StudentFactory(factory.django.DjangoModelFactory):
    name = "Jim"
    school_class = factory.SubFactory(SchoolClassFactory)

    class Meta:
        model = Student

class AssigneeFactory(factory.django.DjangoModelFactory):
    assignment = factory.SubFactory(AssignmentFactory)
    student = factory.SubFactory(StudentFactory)

    class Meta:
        model = Assignee