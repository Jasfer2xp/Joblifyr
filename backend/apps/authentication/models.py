from django.db import models
from django.utils import timezone


class PendingVerification(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=50, default='job_seeker')
    verification_code = models.CharField(max_length=6)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f'Pending: {self.email}'
