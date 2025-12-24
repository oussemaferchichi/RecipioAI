import requests
import json

def test_filtering():
    # We know user 5 has recipes
    user_id = 5
    url = f"http://localhost:8000/api/recipes/?author={user_id}"
    
    # We need a valid token to access if IsAuthenticatedOrReadOnly is set?
    # Actually GET is allowed for ReadOnly.
    # But wait, permissions are IsAuthenticatedOrReadOnly.
    # So GET is public.
    
    try:
        response = requests.get(url)
        print(f"GET {url}")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Count: {len(data)}")
        if len(data) > 0:
            print("Found recipes!")
            print(data[0]['title'])
        else:
            print("No recipes found via API filter.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_filtering()
