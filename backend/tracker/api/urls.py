from django.urls import path
from api import views

urlpatterns = [
    path('api/v1/users/create/', views.create_user, name='create-user'),
    path('api/v1/users/login/', views.user_login, name='jwt-login'),
    #path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
