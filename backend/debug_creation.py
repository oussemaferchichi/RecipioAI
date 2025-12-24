import os
import django
import sys

# Add project root to path
sys.path.append(os.getcwd())

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from recipes.serializers import RecipeSerializer
from django.contrib.auth.models import User
from recipes.models import Recipe
from rest_framework.test import APIRequestFactory

def debug_creation():
    user = User.objects.first()
    if not user:
        user = User.objects.create_user('debug_user', 'debug@example.com', 'pass')
    
    print(f"Using user: {user}")

    # Data as it appears AFTER validation (roughly)
    data = {
        'title': 'Debug Recipe',
        'description': 'Desc',
        'prep_time': 10,
        'cook_time': 20,
        'servings': 4,
        'category': 'Dessert',
        'instructions': ['Step 1'],
        'tags': ['Tag'],
        'dietary_labels': ['Veg'],
        'ingredients': [{'name': 'Ing', 'amount': 1, 'unit': 'pc', 'notes': ''}],
        'image_url': ''
    }
    
    # We are testing the .create() method primarily, but let's go through validation too
    # Serializer expects `ingredients` as list of dicts here (simulating processed JSON)
    
    factory = APIRequestFactory()
    request = factory.post('/')
    request.user = user
    
    # Note: to_internal_value handles the JSON parsing from strings. 
    # Here we pass native python objects, so to_internal_value logic specific to strings won't trigger 
    # unless we pass strings. Let's pass strings for ingredients to fully emulate.
    import json
    raw_data = {
        'title': 'Debug Recipe',
        'description': 'Desc',
        'prep_time': 10,
        'cook_time': 20,
        'servings': 4,
        'category': 'Dessert',
        'instructions': json.dumps(['Step 1']),
        'tags': json.dumps(['Tag']),
        'dietary_labels': json.dumps(['Veg']),
        'ingredients': json.dumps([{'name': 'Ing', 'amount': 1, 'unit': 'pc', 'notes': ''}]),
        'image_url': ''
    }

    serializer = RecipeSerializer(data=raw_data, context={'request': request})

    print("Validating...")
    if serializer.is_valid():
        print("Validation success! Saving...")
        try:
            serializer.save(author=user)
            print("Save success!")
        except Exception as e:
            print("Save FAILED!")
            import traceback
            traceback.print_exc()
    else:
        print("Validation FAILED:", serializer.errors)

if __name__ == "__main__":
    debug_creation()
