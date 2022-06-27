from django.db import models
from accounts.models import CustomUser

class School(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name + self.city

class Teacher(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    school = models.ForeignKey(School,  on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return self.user.name

class Parent(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    invite_code = models.CharField(max_length=8)

    def __str__(self):
        return self.user.name

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(Parent, on_delete=models.DO_NOTHING)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Assignment(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=512)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
    maximum_score = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

class Assignee(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    feedback = models.CharField(max_length=1024, null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.student.name + self.assignment.title

class AssignmentMedia(models.Model):
    assignee = models.ForeignKey(Assignee, on_delete=models.CASCADE)
    file = models.FileField(upload_to="assignment_media/")
    

