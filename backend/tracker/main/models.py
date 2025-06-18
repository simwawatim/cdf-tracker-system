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


from django.db import models


# Optional: Project model, assumed to exist already
class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class ProjectStatusUpdate(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]

    FILE_TYPE_CHOICES = [
        ('application/pdf', 'PDF'),
        ('image/*', 'Image'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='status_updates')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    action_message = models.TextField(blank=True, null=True)
    file_type = models.CharField(max_length=50, choices=FILE_TYPE_CHOICES, default='application/pdf')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.get_status_display()} ({self.created_at.date()})"


def upload_to(instance, filename):
    return f'supporting_documents/project_{instance.status_update.project.id}/{filename}'


class SupportingDocument(models.Model):
    status_update = models.ForeignKey(ProjectStatusUpdate, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to=upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for {self.status_update.project.name} - {self.file.name}"
