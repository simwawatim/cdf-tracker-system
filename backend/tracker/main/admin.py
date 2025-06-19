from django.contrib import admin
from .models import ProjectCategory, Project, ProjectStatusUpdate, SupportingDocument, UserProfile

admin.site.register(ProjectCategory)
admin.site.register(Project)
admin.site.register(ProjectStatusUpdate)
admin.site.register(SupportingDocument)
admin.site.register(UserProfile)
