from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from main.models import ProjectCategory, ProjectStatusUpdate, SupportingDocument, UserProfile, Project
import re

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[^\w\s]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        UserProfile.objects.create(user=user, **profile_data)
        return user




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user_profile = UserProfile.objects.get(user=self.user)
        data['username'] = self.user.username
        data['role'] = user_profile.role
        return data




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']



class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role', 'created_at', 'updated_at']

class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'description']

    def validate(self, attrs):
        for key, value in attrs.items():
            if isinstance(value, str):
                attrs[key] = value.lower()
        return attrs

    def validate_name(self, value):
        value = value.lower()
        if ProjectCategory.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A category with this name already exists.")
        return value
    

class ProjectSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=ProjectCategory.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True)
    create_by = UserProfileSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'progress', 'status',
            'start_date', 'end_date', 'category', 'category_name', 'create_by'
        ]
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': True},
            'progress': {'required': True},
            'start_date': {'required': True},
            'end_date': {'required': True},
            'category': {'required': True},
        }

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and start > end:
            raise serializers.ValidationError("End date must be after start date.")
        return attrs



class ProjectsListSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    create_by = UserSerializer(read_only=True) 

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'progress', 'status',
            'start_date', 'end_date', 'created_at', 'updated_at',
            'category', 'create_by'
        ]


class ProjectGetCategoryName(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']


class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'status']


class SupportingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportingDocument
        fields = ['id', 'file', 'uploaded_at']

class ProjectStatusUpdateSerializer(serializers.ModelSerializer):
    documents = SupportingDocumentSerializer(many=True, read_only=True)
    updated_by = UserSerializer(read_only=True) 

    class Meta:
        model = ProjectStatusUpdate
        fields = ['id', 'project', 'status', 'action_message', 'file_type', 'created_at', 'documents', 'updated_by']




class ProjectViewSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()  
    status_updates = ProjectStatusUpdateSerializer(many=True, read_only=True)  
    updated_by = UserSerializer(read_only=True) 

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'progress', 'status', 'start_date', 'end_date',
            'created_at', 'updated_at', 'category', 'status_updates', 'updated_by'
        ]

class MonthlyProjectProgressSerializer(serializers.Serializer):
    month = serializers.CharField()
    avg_progress = serializers.FloatField()
    project_count = serializers.IntegerField()
