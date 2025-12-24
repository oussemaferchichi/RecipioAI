from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response  
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Recipe, Profile, Ingredient, Rating, Favorite
from .serializers import RecipeSerializer, ProfileSerializer, IngredientSerializer, RatingSerializer
from .auth_serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .ai_utils import get_ingredient_substitute
import django_filters.rest_framework
import json


class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of a recipe to edit/delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner
        return obj.author == request.user


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['title', 'description', 'tags', 'ingredients__name']
    filterset_fields = ['author', 'category']
    ordering_fields = ['created_at', 'prep_time', 'cook_time']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            with open('error_log.txt', 'w') as f:
                f.write(f"Errors: {serializer.errors}\n")
                f.write(f"Initial Data: {request.data}\n")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        recipe = self.get_object()
        user = request.user
        favorite, created = Favorite.objects.get_or_create(user=user, recipe=recipe)
        
        if not created:
            favorite.delete()
            return Response({'is_favorited': False})
        
        return Response({'is_favorited': True})

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        recipe = self.get_object()
        user = request.user
        score = request.data.get('score')
        
        if not score or not (1 <= int(score) <= 5):
            return Response({'error': 'Invalid score. Must be between 1 and 5.'}, status=400)
            
        rating, created = Rating.objects.get_or_create(user=user, recipe=recipe, defaults={'score': score})
        
        if not created:
            rating.score = score
            rating.save()
            
        return Response({'rating_avg': recipe.rating_avg}) # This will use the property if defined or the serializer method

    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        user = request.user
        favorites = Recipe.objects.filter(favorited_by__user=user)
        page = self.paginate_queryset(favorites)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def substitute(self, request):
        ingredient = request.data.get('ingredient')
        restrictions = request.data.get('restrictions', "")
        allergies = request.data.get('allergies', "")
        
        if not ingredient:
            return Response({"error": "Ingredient is required"}, status=400)
            
        try:
            result = get_ingredient_substitute(ingredient, restrictions, allergies)
            return Response(json.loads(result))
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.AllowAny]

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserSerializer(request.user).data)
