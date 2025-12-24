import requests
import os

URL = "https://tsyendyrtazavgwrzjxr.supabase.co"
API_KEY = "sb_publishable__xG5zRY-zRxQizVY9jX0_A_tQfoTUO9"
BUCKET = "recipe-images"
FILE_PATH = "test_image.jpg"

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "image/jpeg"
}

# Read file
try:
    with open(FILE_PATH, "rb") as f:
        file_content = f.read()
            
    print(f"Uploading {FILE_PATH} to {BUCKET}...")
    
    # Upload
    filename = "test_upload_verification.jpg"
    response = requests.post(
        f"{URL}/storage/v1/object/{BUCKET}/{filename}", 
        headers=headers, 
        data=file_content
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("SUCCESS: File uploaded.")
    else:
        print("FAILURE: Upload failed.")

except Exception as e:
    print(f"ERROR: {e}")
