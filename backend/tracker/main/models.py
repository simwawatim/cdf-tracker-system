from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ROLES_CHOICES = (
        ('admin', 'Admin'),
        ('maker', 'Maker'),
        ('checker', 'Checker'),
    )
    role = models.CharField(max_length=10, choices=ROLES_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
