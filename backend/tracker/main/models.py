from django.db import models
from django.db.models import SET_NULL
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
    
class ProjectCategory(models.Model):
    name = models.CharField()
    description = models.CharField()

    def __str__(self):
        self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    category = models.ForeignKey(ProjectCategory, on_delete=SET_NULL, null=True)
    description = models.TextField(blank=True)
    name = models.CharField(max_length=255)
    progress = models.PositiveIntegerField(default=0) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.project}"