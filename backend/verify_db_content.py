import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from recipes.models import Recipe
from django.contrib.auth.models import User

def check_data():
    print(f"Total Users: {User.objects.count()}")
    for u in User.objects.all():
        print(f"User: {u.username} (ID: {u.id})")

    print(f"\nTotal Recipes: {Recipe.objects.count()}")
    for r in Recipe.objects.all():
        print(f"Recipe: '{r.title}' by Author ID: {r.author_id} (Category: {r.category})")

if __name__ == "__main__":
    check_data()
