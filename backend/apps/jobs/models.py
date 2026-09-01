from django.db import models

from apps.users.models import JoblifyrUser


class Job(models.Model):
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    work_mode = models.CharField(max_length=50, default='Remote')
    pay_range = models.CharField(max_length=100)
    pay_full = models.CharField(max_length=100, blank=True)
    job_type = models.CharField(max_length=50, default='Full-time')
    description = models.TextField()
    full_description = models.TextField(blank=True)
    responsibilities = models.JSONField(default=list)
    logo_text = models.CharField(max_length=10, blank=True)
    logo_bg = models.CharField(max_length=100, blank=True)
    match_score = models.CharField(max_length=20, blank=True, null=True)
    posted_label = models.CharField(max_length=50, default='Posted recently')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} at {self.company_name}'


class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(JoblifyrUser, on_delete=models.CASCADE, related_name='applications')
    match_score = models.IntegerField(default=95)
    status = models.CharField(max_length=50, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'applicant')
