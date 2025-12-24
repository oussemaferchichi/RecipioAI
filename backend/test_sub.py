import os
import sys

# Add backend to path
sys.path.append(r'c:\Users\victus\Desktop\RECIPIO AI\backend')

from recipes.ai_utils import get_ingredient_substitute
import json

def test_substitute():
    print("Testing AI Substitute for 'egg'...")
    try:
        result = get_ingredient_substitute("egg", "vegan", "none")
        print("Raw result:", result)
        data = json.loads(result)
        if 'alternatives' in data:
            print("SUCCESS: Found 'alternatives' key.")
            for alt in data['alternatives']:
                print(f"- {alt['name']}: {alt['reason']}")
        else:
            print("FAILURE: 'alternatives' key not found in response.")
            print("Keys found:", data.keys())
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_substitute()
