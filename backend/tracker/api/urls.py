from django.urls import path
from api import views

urlpatterns = [
    path('api/v1/users/create/', views.create_user, name='create-user'),
    path('api/v1/users/login/', views.user_login, name='jwt-login'),
    path('api/v1/users/all-users/', views.get_all_users, name='get_all_users'),
    path('api/v1/project-category/', views.create_project_category, name='create_project_category'),
    path('api/v1/get-project-category/', views.get_project_category, name='get_project_category'),
    path('api/v1/create-project/', views.create_project, name='create_project'),
]
