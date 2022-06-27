from django.db import models
from accounts.models import CustomUser

class School(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

class Teacher(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    school = models.ForeignKey(School,  on_delete=models.DO_NOTHING, null=True, blank=True)

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.DO_NOTHING, null=True, blank=True)

class Assignment(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=512)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
    maximum_score = models.IntegerField(null=True, blank=True)

# class Assignee(models.Model):
    

