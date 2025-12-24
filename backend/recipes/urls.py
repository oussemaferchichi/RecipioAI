from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, ProfileViewSet, IngredientViewSet, register, login, get_current_user

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'ingredients', IngredientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', get_current_user, name='current-user'),
]

