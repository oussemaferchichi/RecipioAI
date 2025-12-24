import requests

URL = "https://tsyendyrtazavgwrzjxr.supabase.co"
API_KEY = "sb_publishable__xG5zRY-zRxQizVY9jX0_A_tQfoTUO9"

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}"
}

print(f"Testing connection to {URL}...")

try:
    # Try to list buckets to verify storage access
    response = requests.get(f"{URL}/storage/v1/bucket", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("SUCCESS: Credentials appear valid.")
    else:
        print("FAILURE: Credentials might be invalid or permissions are missing.")
        
except Exception as e:
    print(f"ERROR: {e}")
