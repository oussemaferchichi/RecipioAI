from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from recipes.models import Recipe, Ingredient
import random

class Command(BaseCommand):
    help = 'Seeds the database with popular recipes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding recipes...')

        # Create a chef user
        chef, created = User.objects.get_or_create(username='ChefBot', email='chef@recipio.ai')
        if created:
            chef.set_password('chef123')
            chef.save()
            self.stdout.write('Created ChefBot user')

        recipes_data = [
            {
                "title": "Classic Margherita Pizza",
                "description": "A simple yet delicious Italian classic with fresh basil and mozzarella.",
                "prep_time": 20, "cook_time": 15, "servings": 2, "category": "Italian",
                "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
                "tags": ["Pizza", "Vegetarian", "Classic"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Pizza Dough", "1", "ball"), ("Tomato Sauce", "1/2", "cup"), 
                    ("Fresh Mozzarella", "200", "g"), ("Fresh Basil", "1", "handful")
                ],
                "instructions": ["Roll out dough.", "Spread sauce.", "Add cheese.", "Bake at 450F for 15 mins.", "Top with basil."]
            },
            {
                "title": "Spaghetti Carbonara",
                "description": "Authentic Roman pasta dish with eggs, cheese, guanciale, and pepper.",
                "prep_time": 15, "cook_time": 15, "servings": 4, "category": "Italian",
                "image_url": "https://images.unsplash.com/photo-1612874742237-9828fa362674?w=800",
                "tags": ["Pasta", "Quick", "Dinner"],
                "dietary_labels": [],
                "ingredients": [
                    ("Spaghetti", "400", "g"), ("Eggs", "4", "large"), 
                    ("Pecorino Romano", "1", "cup"), ("Guanciale", "150", "g"), ("Black Pepper", "1", "tsp")
                ],
                "instructions": ["Boil pasta.", "Fry guanciale.", "Whisk eggs and cheese.", "Toss pasta with egg mixture off heat.", "Serve immediately."]
            },
            {
                "title": "Chicken Tikka Masala",
                "description": "Roasted marinated chicken chunks in a spiced curry sauce.",
                "prep_time": 30, "cook_time": 40, "servings": 4, "category": "Asian",
                "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
                "tags": ["Curry", "Spicy", "Chicken"],
                "dietary_labels": ["Gluten-Free"],
                "ingredients": [
                    ("Chicken Breast", "500", "g"), ("Yogurt", "1", "cup"), 
                    ("Tomato Puree", "1", "cup"), ("Cream", "1/2", "cup"), ("Spices", "2", "tbsp")
                ],
                "instructions": ["Marinate chicken in yogurt and spices.", "Grill chicken.", "Simmer sauce.", "Combine and cook for 10 mins."]
            },
            {
                "title": "Beef Tacos",
                "description": "Ground beef tacos with classic toppings in crispy shells.",
                "prep_time": 15, "cook_time": 15, "servings": 3, "category": "Mexican",
                "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
                "tags": ["Tacos", "Beef", "Dinner"],
                "dietary_labels": [],
                "ingredients": [
                    ("Ground Beef", "500", "g"), ("Taco Shells", "6", "pcs"), 
                    ("Lettuce", "1", "head"), ("Cheddar Cheese", "1", "cup"), ("Salsa", "1", "cup")
                ],
                "instructions": ["Brown the beef.", "Add taco seasoning.", "Warm shells.", "Assemble tacos."]
            },
            {
                "title": "Avocado Toast",
                "description": "Creamy avocado on toasted sourdough, perfect for breakfast.",
                "prep_time": 5, "cook_time": 5, "servings": 1, "category": "Breakfast",
                "image_url": "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800",
                "tags": ["Healthy", "Breakfast", "Quick"],
                "dietary_labels": ["Vegetarian", "Vegan"],
                "ingredients": [
                    ("Sourdough Bread", "2", "slices"), ("Avocado", "1", "ripe"), 
                    ("Lemon Juice", "1", "tsp"), ("Chili Flakes", "1", "pinch"), ("Salt", "1", "pinch")
                ],
                "instructions": ["Toast bread.", "Mash avocado with lemon.", "Spread on toast.", "Sprinkle spices."]
            },
            {
                "title": "Sushi Rolls (Maki)",
                "description": "Fresh cucumber and avocado sushi rolls.",
                "prep_time": 40, "cook_time": 20, "servings": 2, "category": "Asian",
                "image_url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
                "tags": ["Sushi", "Japanese", "Seafood"],
                "dietary_labels": ["Pescatarian"],
                "ingredients": [
                    ("Sushi Rice", "2", "cups"), ("Nori Sheets", "5", ""), 
                    ("Cucumber", "1", ""), ("Avocado", "1", ""), ("Soy Sauce", "1", "tbsp")
                ],
                "instructions": ["Cook rice and season.", "Place nori on mat.", "Spread rice.", "Add fillings.", "Roll tight and slice."]
            },
            {
                "title": "Caesar Salad",
                "description": "Crisp romaine hearts with parmesan, croutons and caesar dressing.",
                "prep_time": 15, "cook_time": 0, "servings": 2, "category": "Salad",
                "image_url": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
                "tags": ["Salad", "Healthy", "Side"],
                "dietary_labels": [],
                "ingredients": [
                    ("Romaine Lettuce", "1", "head"), ("Parmesan", "1/2", "cup"), 
                    ("Croutons", "1", "cup"), ("Caesar Dressing", "1/4", "cup")
                ],
                "instructions": ["Chop lettuce.", "Toss with dressing.", "Top with cheese and croutons."]
            },
            {
                "title": "Pancakes",
                "description": "Fluffy buttermilk pancakes with maple syrup.",
                "prep_time": 10, "cook_time": 15, "servings": 4, "category": "Breakfast",
                "image_url": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
                "tags": ["Breakfast", "Sweet", "Classic"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Flour", "2", "cups"), ("Milk", "1.5", "cups"), 
                    ("Eggs", "2", ""), ("Butter", "2", "tbsp"), ("Maple Syrup", "1", "cup")
                ],
                "instructions": ["Mix dry ingredients.", "Mix wet ingredients.", "Combine.", "Cook on griddle until bubbly."]
            },
            {
                "title": "Grilled Cheese Sandwich",
                "description": "The ultimate comfort food with gooey melted cheese.",
                "prep_time": 5, "cook_time": 10, "servings": 1, "category": "Lunch",
                "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
                "tags": ["Sandwich", "Quick", "Comfort"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Bread", "2", "slices"), ("Cheddar Cheese", "2", "slices"), ("Butter", "1", "tbsp")
                ],
                "instructions": ["Butter bread.", "Place cheese between slices.", "Grill in pan until golden."]
            },
            {
                "title": "Chocolate Chip Cookies",
                "description": "Chewy inside, crispy edges, loaded with chocolate.",
                "prep_time": 15, "cook_time": 10, "servings": 24, "category": "Dessert",
                "image_url": "https://images.unsplash.com/photo-1499636138143-bd649043ea80?w=800",
                "tags": ["Dessert", "Baking", "Sweet"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Flour", "2", "cups"), ("Butter", "1", "cup"), 
                    ("Sugar", "1", "cup"), ("Chocolate Chips", "1", "pack")
                ],
                "instructions": ["Cream butter and sugar.", "Add eggs and dry ingredients.", "Fold in chips.", "Bake at 350F for 10 mins."]
            },
             {
                "title": "Mushroom Risotto",
                "description": "Creamy Italian rice dish with porcini mushrooms.",
                "prep_time": 15, "cook_time": 30, "servings": 4, "category": "Italian",
                "image_url": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
                "tags": ["Rice", "Dinner", "Italian"],
                "dietary_labels": ["Gluten-Free"],
                "ingredients": [
                    ("Arborio Rice", "1.5", "cups"), ("Mushrooms", "200", "g"), 
                    ("Vegetable Stock", "1", "liter"), ("Parmesan", "1/2", "cup"), ("White Wine", "1/2", "cup")
                ],
                "instructions": ["Sauté mushrooms.", "Toast rice.", "Add wine.", "Add hot stock ladle by ladle.", "Finish with cheese."]
            },
            {
                "title": "Pad Thai",
                "description": "Stir-fried rice noodle dish commonly served as street food in Thailand.",
                "prep_time": 20, "cook_time": 10, "servings": 2, "category": "Asian",
                "image_url": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
                "tags": ["Noodles", "Thai", "Spicy"],
                "dietary_labels": ["Dairy-Free"],
                "ingredients": [
                    ("Rice Noodles", "200", "g"), ("Shrimp", "100", "g"), 
                    ("Peanuts", "2", "tbsp"), ("Bean Sprouts", "1", "cup"), ("Egg", "1", "")
                ],
                "instructions": ["Soak noodles.", "Stir fry shrimp and egg.", "Add noodles and sauce.", "Top with peanuts."]
            },
            {
                "title": "Greek Salad",
                "description": "Refreshing salad with tomatoes, cucumber, olives, and feta.",
                "prep_time": 15, "cook_time": 0, "servings": 2, "category": "Salad",
                "image_url": "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800",
                "tags": ["Salad", "Healthy", "Greek"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Cucumber", "1", ""), ("Tomatoes", "2", ""), 
                    ("Feta Cheese", "100", "g"), ("Kalamata Olives", "1/2", "cup"), ("Oregano", "1", "tsp")
                ],
                "instructions": ["Chop vegetables.", "Combine in bowl.", "Add olives and feta.", "Drizzle with oil and oregano."]
            },
            {
                "title": "French Onion Soup",
                "description": "Rich beef broth packed with caramelized onions and topped with cheese toast.",
                "prep_time": 20, "cook_time": 60, "servings": 4, "category": "Soup",
                "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
                "tags": ["Soup", "French", "Comfort"],
                "dietary_labels": [],
                "ingredients": [
                    ("Onions", "5", "large"), ("Beef Broth", "1", "liter"), 
                    ("Gruyere Cheese", "1", "cup"), ("Baguette", "4", "slices"), ("Butter", "2", "tbsp")
                ],
                "instructions": ["Caramelize onions slowly.", "Add broth and simmer.", "Top with bread and cheese.", "Broil until bubbly."]
            },
            {
                "title": "Banana Bread",
                "description": "Moist and sweet loaf made from ripe bananas.",
                "prep_time": 15, "cook_time": 60, "servings": 10, "category": "Dessert",
                "image_url": "https://images.unsplash.com/photo-1596223575327-99a5be4bab12?w=800",
                "tags": ["Baking", "Breakfast", "Sweet"],
                "dietary_labels": ["Vegetarian"],
                "ingredients": [
                    ("Bananas", "3", "ripe"), ("Flour", "1.5", "cups"), 
                    ("Sugar", "3/4", "cup"), ("Egg", "1", ""), ("Butter", "1/3", "cup")
                ],
                "instructions": ["Mash bananas.", "Mix wet ingredients.", "Fold in dry ingredients.", "Bake at 350F for 1 hour."]
            },
            {
                "title": "Falafel Wrap",
                "description": "Crispy chickpea balls in pita with tahini sauce.",
                "prep_time": 30, "cook_time": 15, "servings": 4, "category": "Middle Eastern",
                "image_url": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
                "tags": ["Vegan", "Lunch", "Healthy"],
                "dietary_labels": ["Vegan", "Vegetarian"],
                "ingredients": [
                    ("Chickpeas", "2", "cups"), ("Parsley", "1", "bunch"), 
                    ("Pita Bread", "4", ""), ("Tahini", "1/2", "cup"), ("Garlic", "2", "cloves")
                ],
                "instructions": ["Blend soaked chickpeas with herbs.", "Form balls and fry.", "Serve in pita with tahini."]
            },
            {
                "title": "Tom Yum Soup",
                "description": "Spicy and sour Thai soup with shrimp.",
                "prep_time": 15, "cook_time": 20, "servings": 2, "category": "Soup",
                "image_url": "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?w=800",
                "tags": ["Soup", "Thai", "Spicy"],
                "dietary_labels": ["Dairy-Free"],
                "ingredients": [
                    ("Shrimp", "200", "g"), ("Lemongrass", "2", "stalks"), 
                    ("Mushrooms", "1", "cup"), ("Lime Juice", "2", "tbsp"), ("Chili Paste", "1", "tbsp")
                ],
                "instructions": ["Boil broth with herbs.", "Add mushrooms and shrimp.", "Season with lime and chili.", "Garnish with cilantro."]
            },
            {
                "title": "Lasagna",
                "description": "Layered pasta with meat sauce, ricotta, and mozzarella.",
                "prep_time": 45, "cook_time": 60, "servings": 8, "category": "Italian",
                "image_url": "https://images.unsplash.com/photo-1574868235945-060fadb9b80e?w=800",
                "tags": ["Pasta", "Dinner", "Comfort"],
                "dietary_labels": [],
                "ingredients": [
                    ("Lasagna Noodles", "1", "box"), ("Ground Beef", "500", "g"), 
                    ("Marinara Sauce", "2", "jars"), ("Ricotta Cheese", "500", "g"), ("Mozzarella", "2", "cups")
                ],
                "instructions": ["Cook meat sauce.", "Layer noodles, cheese, and sauce.", "Repeat.", "Bake covered then uncovered."]
            },
            {
                "title": "Hummus",
                "description": "Creamy dip made from chickpeas, tahini, lemon, and garlic.",
                "prep_time": 10, "cook_time": 0, "servings": 6, "category": "Snack",
                "image_url": "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=800",
                "tags": ["Dip", "Healthy", "Vegan"],
                "dietary_labels": ["Vegan", "Gluten-Free"],
                "ingredients": [
                    ("Chickpeas", "1", "can"), ("Tahini", "1/3", "cup"), 
                    ("Lemon Juice", "1", "lemon"), ("Garlic", "1", "clove"), ("Olive Oil", "2", "tbsp")
                ],
                "instructions": ["Blend all ingredients until smooth.", "Drizzle with olive oil.", "Serve with veggies or pita."]
            },
            {
                "title": "Beef Stir Fry",
                "description": "Quick beef strips cooked with colorful vegetables.",
                "prep_time": 15, "cook_time": 10, "servings": 3, "category": "Asian",
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
                "tags": ["Beef", "Quick", "Dinner"],
                "dietary_labels": ["Dairy-Free"],
                "ingredients": [
                    ("Beef Strips", "400", "g"), ("Broccoli", "1", "head"), 
                    ("Bell Peppers", "2", ""), ("Soy Sauce", "3", "tbsp"), ("Ginger", "1", "tbsp")
                ],
                "instructions": ["Sear beef in hot pan.", "Remove beef.", "Stir fry veggies.", "Return beef and add sauce."]
            }
        ]

        count = 0
        for data in recipes_data:
            recipe, created = Recipe.objects.get_or_create(
                title=data['title'],
                author=chef,
                defaults={
                    'description': data['description'],
                    'prep_time': data['prep_time'],
                    'cook_time': data['cook_time'],
                    'servings': data['servings'],
                    'category': data['category'],
                    'image_url': data['image_url'],
                    'tags': data['tags'],
                    'dietary_labels': data['dietary_labels'],
                    'instructions': data['instructions']
                }
            )
            
            if created:
                count += 1
                for ing_name, ing_amount, ing_unit in data['ingredients']:
                    Ingredient.objects.create(
                        recipe=recipe,
                        name=ing_name,
                        amount=ing_amount,
                        unit=ing_unit
                    )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} recipes!'))
