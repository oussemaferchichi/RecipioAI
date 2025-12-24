import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from recipes.ai_utils import get_ingredient_substitute

try:
    print("Testing AI substitution...")
    print(f"GROQ_API_KEY is {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
    
    result = get_ingredient_substitute("Heavy Cream", "Vegan", "Nuts")
    print("\nSuccess! Result:")
    print(result)
except Exception as e:
    print(f"\nError: {type(e).__name__}")
    print(f"Message: {str(e)}")
    import traceback
    traceback.print_exc()
