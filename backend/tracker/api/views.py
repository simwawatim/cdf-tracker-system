from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializer.serializers import ProjectGetCategoryName, ProjectStatusSerializer, ProjectStatusUpdateSerializer, ProjectViewSerializer, ProjectsListSerializer, UserProfileSerializer, UserSerializer, ProjectCategorySerializer, ProjectSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.response import Response
from main.models import Project, SupportingDocument, UserProfile
from django.shortcuts import get_object_or_404, render
from rest_framework import status
from main.models import ProjectCategory
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()

        role = request.data.get('role', 'user')
        UserProfile.objects.create(user=user, role=role)

        subject = 'Your Account Has Been Created'
        message = f"""
        Hello {user.username},

        Your account has been successfully created.

        Username: {user.username}
        Email: {user.email}
        Password: {password}
        Role: {role}

        Please keep this information secure.
        """
        recipient_list = [user.email]
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list, fail_silently=False)

        return Response({"message": "User and profile created successfully"}, status=status.HTTP_201_CREATED)

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
@permission_classes([IsAuthenticated])
def get_all_users(request):
    user = request.user 
    print(f"Request made by: {user.username}")
    profiles = UserProfile.objects.select_related('user').all()
    serializer = UserProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project_category(request):
    serializer = ProjectCategorySerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Project category created!"}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project_category(request):
    project_categories = ProjectCategory.objects.all()
    serializers =ProjectCategorySerializer(project_categories, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = ProjectSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(create_by=request.user)
        return Response({"message": "Project created!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_projects(request):
    all_projects = Project.objects.all()
    serializer = ProjectsListSerializer(all_projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
5

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_category_by_name(request):
    category_name = ProjectCategory.objects.all()
    serializers = ProjectGetCategoryName(category_name, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_project_status(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectStatusSerializer(project, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project_by_id(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectViewSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_project_status_update(request):
    project_id = request.data.get("project")

    if not project_id:
        return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    project = get_object_or_404(Project, pk=project_id)
    serializer = ProjectStatusUpdateSerializer(data=request.data)

    if serializer.is_valid():
        status_update = serializer.save(project=project, updated_by=request.user)
        project.status = status_update.status
        project.save(update_fields=['status'])

        files = request.FILES.getlist('supporting_files')
        for file_obj in files:
            SupportingDocument.objects.create(status_update=status_update, file=file_obj)

        return Response(ProjectStatusUpdateSerializer(status_update).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
