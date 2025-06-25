import google.generativeai as genai

genai.configure(api_key="AIzaSyD4HbEplCKxs00LSdBAI1jhBoQWd4IGOC0")

try:
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    response = model.generate_content("Say hello!")
    print("Gemini API response:", response.text)
except Exception as e:
    print("Error:", e)