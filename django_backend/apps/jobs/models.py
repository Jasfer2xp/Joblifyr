from django.db import models
from apps.authentication.models import JoblifyrUser

class Job(models.Model):
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    work_mode = models.CharField(max_length=50, default='Remote') # Remote, Hybrid, On-site
    pay_range = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50, default='Full-time')
    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company_name}"

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(JoblifyrUser, on_delete=models.CASCADE, related_name='applications')
    match_score = models.IntegerField(default=95)
    status = models.CharField(max_length=50, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
