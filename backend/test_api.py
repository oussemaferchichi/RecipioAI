import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_full_flow():
    # 1. Register User
    email = "upload_test@recipio.ai"
    password = "test123456"
    print(f"1. Registering user {email}...")
    
    register_data = {
        "email": email,
        "password": password,
        "name": "Upload Tester"
    }
    
    # Try register
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        if response.status_code == 400 and 'email' in response.json() and response.json()['email'][0] == 'user with this email already exists.':
            print("   User exists, logging in...")
            response = requests.post(f"{BASE_URL}/auth/login/", json={"email": email, "password": password})
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    if response.status_code not in [200, 201]:
        print(f"Authentication failed: {response.text}")
        return

    tokens = response.json()['tokens']
    access_token = tokens['access']
    headers = {'Authorization': f'Bearer {access_token}'}
    print("   Authentication successful!")

    # 2. Create Recipe with Image
    print("\n2. Creating recipe with image upload...")
    
    files = {
        'image': ('test_image.jpg', open('test_image.jpg', 'rb'), 'image/jpeg')
    }
    
    data = {
        'title': 'Backend Upload Test Recipe',
        'description': 'Testing multipart upload with image',
        'prep_time': 10,
        'cook_time': 20,
        'servings': 4,
        'category': 'Dessert',
        'instructions': '["Step 1: Test", "Step 2: Upload"]',
        'tags': '["Test", "Backend"]',
        'dietary_labels': '["Vegetarian"]',
        'ingredients': json.dumps([
            {'name': 'Test Ingredient', 'amount': '1', 'unit': 'pc', 'notes': 'Test notes'}
        ]),
        'image_url': ''
    }

    try:
        response = requests.post(f"{BASE_URL}/recipes/", data=data, files=files, headers=headers)
        if response.status_code == 201:
            recipe = response.json()
            print(f"   Recipe created successfully! ID: {recipe['id']}")
            print(f"   Image URL: {recipe['image']}")
            
            # Verify image is accessible
            if recipe['image']:
                img_url = recipe['image']
                if not img_url.startswith('http'):
                    img_url = f"http://localhost:8000{img_url}"
                img_resp = requests.get(img_url)
                if img_resp.status_code == 200:
                    print(f"   Image is accessible at {img_url}")
                else:
                    print(f"   WARNING: Image inaccessible at {img_url} ({img_resp.status_code})")
        else:
            print(f"   Creation failed: {response.status_code} - {response.text}")
            return
    finally:
        files['image'][1].close()

    # 3. Test Social Features
    recipe_id = recipe['id']
    print(f"\n3. Testing social features for Recipe {recipe_id}...")
    
    # Toggle Favorite
    print("   Toggling favorite...")
    fav_resp = requests.post(f"{BASE_URL}/recipes/{recipe_id}/toggle_favorite/", headers=headers)
    print(f"   Favorite status: {fav_resp.json()}")
    
    # Rate
    print("   Rating 5 stars...")
    rate_resp = requests.post(f"{BASE_URL}/recipes/{recipe_id}/rate/", json={'score': 5}, headers=headers)
    print(f"   New rating: {rate_resp.json()}")

    print("\nBackend verification complete!")

if __name__ == "__main__":
    test_full_flow()
