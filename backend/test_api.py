import requests

def test_digest_api():
    url = "http://127.0.0.1:5000/api/digest"
    
    # Test data
    data = {
        "preferences": {
            "topics": ["technology", "science"]
        }
    }
    
    # Make the POST request
    try:
        response = requests.post(url, json=data)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_digest_api() 