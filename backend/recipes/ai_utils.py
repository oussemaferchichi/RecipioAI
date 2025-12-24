import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ingredient_substitute(ingredient_name, user_restrictions="", user_allergies=""):
    prompt = f"""
    The user wants to substitute the ingredient: '{ingredient_name}'.
    User Dietary Restrictions: {user_restrictions}
    User Allergies: {user_allergies}
    
    Provide 3 smart, logical, and culinary-accurate alternatives.
    CRITICAL: You must return ONLY a JSON object with a single key 'alternatives' containing a list of objects with 'name', 'reason', and 'texture_impact' keys.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a professional culinary assistant focused on dietary accommodations."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    
    return chat_completion.choices[0].message.content


def generate_recipe_from_ingredients(ingredients_text, user_restrictions="", user_allergies=""):
    """
    Generate a complete recipe from a list of ingredients using AI.
    
    Args:
        ingredients_text (str): Comma-separated or line-separated list of ingredients
        user_restrictions (str): User's dietary restrictions
        user_allergies (str): User's allergies
    
    Returns:
        dict: Generated recipe with title, description, ingredients, instructions, etc.
    """
    prompt = f"""
    You are a professional chef and recipe creator. The user has the following ingredients available:
    {ingredients_text}
    
    User's Dietary Restrictions: {user_restrictions if user_restrictions else "None"}
    User's Allergies: {user_allergies if user_allergies else "None"}
    
    Create a delicious, creative, and practical recipe using ONLY the ingredients provided (or allow common pantry staples like salt, pepper, oil).
    The recipe MUST respect the user's dietary restrictions and allergies.
    
    CRITICAL: Return ONLY a valid JSON object with this EXACT structure:
    {{
        "title": "Recipe Name",
        "description": "Brief appealing description (1-2 sentences)",
        "ingredients": [
            {{"name": "ingredient name", "amount": "quantity", "unit": "measurement unit"}},
            ...
        ],
        "instructions": [
            "Step 1 detailed instruction",
            "Step 2 detailed instruction",
            ...
        ],
        "prep_time": <number in minutes>,
        "cook_time": <number in minutes>,
        "servings": <number of servings>,
        "category": "cuisine type (e.g., Italian, Asian, American, Healthy, Dessert)"
    }}
    
    Make the recipe realistic, delicious, and easy to follow. Include at least 4-6 detailed instruction steps.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a world-class chef who creates amazing recipes. You always return valid JSON."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        temperature=0.7
    )
    
    response_text = chat_completion.choices[0].message.content
    
    try:
        recipe_data = json.loads(response_text)
        return recipe_data
    except json.JSONDecodeError as e:
        # Fallback in case JSON parsing fails
        return {
            "error": "Failed to parse AI response",
            "raw_response": response_text
        }

