from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializer.serializers import ProjectsListSerializer, UserProfileSerializer, UserSerializer, ProjectCategorySerializer, ProjectSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.response import Response
from main.models import Project, UserProfile
from django.shortcuts import render
from rest_framework import status
from main.models import ProjectCategory


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)

    user = authenticate(username=user.username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        try:
            role = user.userprofile.role
        except UserProfile.DoesNotExist:
            role = "unknown"
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'role': role,
        })
    return Response({'error': 'Invalid credentials'}, status=401)


@api_view(['GET'])
def get_all_users(request):
    profiles = UserProfile.objects.select_related('user').all()
    serializer = UserProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_project_category(request):
    serializer = ProjectCategorySerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Project category created!"}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_project_category(request):
    project_categories = ProjectCategory.objects.all()
    serializers =ProjectCategorySerializer(project_categories, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def create_project(request):
    serializer = ProjectSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Project created !"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_projects(request):
    all_projects = Project.objects.all()
    serializer = ProjectsListSerializer(all_projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
