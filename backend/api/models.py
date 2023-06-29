from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=100)
    users = models.ManyToManyField(User, related_name="projects")

    def __str__(self):
        return self.name


class TimeRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    description = models.CharField(max_length=100)
    time_started = models.DateTimeField()
    time_ended = models.DateTimeField()
    duration = models.DurationField()

    def __str__(self) -> str:
        return f"{self.project} - {self.description} - {self.duration}"

    def save(self, *args, **kwargs):
        self.duration = self.time_ended - self.time_started
        super(TimeRecord, self).save(*args, **kwargs)
