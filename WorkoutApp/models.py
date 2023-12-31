from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
# Create your models here.

class User(AbstractUser):
    pass

class Workout(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Client")
    created = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=500)
    workout = models.JSONField()


class Exercise(models.Model):
    exercise_name = models.CharField(max_length=75)
    image = models.CharField(max_length=500)
    video = models.CharField(max_length=500)
    description = models.CharField(max_length=500)

class Program(models.Model):
    program_name = models.CharField(max_length=75)
    program = models.JSONField()
