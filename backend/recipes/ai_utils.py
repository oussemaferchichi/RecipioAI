import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ingredient_substitute(ingredient_name, user_restrictions="", user_allergies=""):
    prompt = f"""
    The user wants to substitute the ingredient: '{ingredient_name}'.
    User Dietary Restrictions: {user_restrictions}
    User Allergies: {user_allergies}
    
    Provide 3 smart, logical, and culinary-accurate alternatives.
    Format the response as a JSON list of objects with 'name', 'reason', and 'texture_impact' keys.
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
