from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Ingredient, Profile, Rating, Favorite
import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'avatar_url', 'dietary_restrictions', 'allergies']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'amount', 'unit', 'notes']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    author = UserSerializer(read_only=True)
    rating_avg = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = '__all__'

    def get_rating_avg(self, obj):
        ratings = obj.ratings.all()
        if not ratings:
            return 0
        return sum(r.score for r in ratings) / len(ratings)

    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.favorited_by.filter(user=user).exists()
        return False

    def get_user_rating(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            rating = obj.ratings.filter(user=user).first()
            return rating.score if rating else 0
        return 0

    def to_internal_value(self, data):
        # Handle multipart/form-data where complex fields are JSON strings
        if hasattr(data, 'dict'):  # Checks if it's QueryDict (multipart)
            data = data.dict()
        
        # Create a mutable copy if possible, otherwise work with what we have
        if isinstance(data, dict):
            mutable_data = data.copy()
        else:
            mutable_data = dict(data)

        json_fields = ['ingredients', 'instructions', 'tags', 'dietary_labels']
        for field in json_fields:
            if field in mutable_data and isinstance(mutable_data[field], str):
                try:
                    mutable_data[field] = json.loads(mutable_data[field])
                except json.JSONDecodeError:
                    pass
        
        return super().to_internal_value(mutable_data)

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        recipe = Recipe.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        
        # Update recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update ingredients if provided
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ingredient_data)
        
        return instance

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Rating
        fields = '__all__'
