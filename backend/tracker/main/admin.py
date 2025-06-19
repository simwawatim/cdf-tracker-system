from django.contrib import admin
from .models import ProjectCategory, Project, ProjectStatusUpdate, SupportingDocument

admin.site.register(ProjectCategory)
admin.site.register(Project)
admin.site.register(ProjectStatusUpdate)
admin.site.register(SupportingDocument)
