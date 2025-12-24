import os
import django
import random
import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from recipes.models import Recipe

# Placeholder image URLs (Unsplash random images)
PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556912167-f556f1f39b6f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
]

def get_or_create_chef_user():
    user, created = User.objects.get_or_create(username='chef', defaults={'email': 'chef@example.com', 'password': 'chefpass'})
    if created:
        user.set_password('chefpass')
        user.save()
    return user

def ensure_image_for_recipe(recipe):
    if not recipe.image_url:
        recipe.image_url = random.choice(PLACEHOLDER_IMAGES)
        recipe.save()
        print(f"Updated recipe {recipe.id} with placeholder image.")

def create_placeholder_recipe(user, index):
    title = f"Placeholder Recipe {index}"
    description = "A delicious placeholder recipe generated automatically."
    recipe = Recipe.objects.create(
        author=user,
        title=title,
        description=description,
        prep_time=random.randint(5, 30),
        cook_time=random.randint(10, 60),
        servings=random.randint(1, 6),
        category='Other',
        instructions=["Step 1: Do something.", "Step 2: Do something else."],
        tags=["placeholder", "auto"],
        dietary_labels=[],
        image_url=random.choice(PLACEHOLDER_IMAGES),
        is_public=True,
    )
    print(f"Created placeholder recipe {recipe.id}.")
    return recipe

def main():
    chef = get_or_create_chef_user()
    # Ensure existing recipes have images
    for recipe in Recipe.objects.all():
        ensure_image_for_recipe(recipe)
    # Ensure at least 20 recipes exist
    total = Recipe.objects.count()
    needed = max(0, 20 - total)
    for i in range(needed):
        create_placeholder_recipe(chef, total + i + 1)
    print(f"Total recipes after seeding: {Recipe.objects.count()}")

if __name__ == "__main__":
    main()
