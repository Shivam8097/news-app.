from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Configure Gemini API if key is available
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Add a test route
@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to News Digest API",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "api_keys_configured": bool(NEWSDATA_API_KEY and GEMINI_API_KEY)
    })

@app.route('/test')
def test():
    return jsonify({"message": "Test route is working!"})

def fetch_news(preferences):
    if not NEWSDATA_API_KEY:
        return []
        
    try:
        # NewsData.io API endpoint
        url = 'https://newsdata.io/api/1/news'
        
        # Prepare query parameters
        params = {
            'apikey': NEWSDATA_API_KEY,
            'language': preferences.get('language', 'en'),  # Use selected language
            'size': 5,  # Number of articles to fetch
            'q': 'technology OR science'  # Default search query
        }
        
        # Add category if specified in preferences
        if preferences.get('topics'):
            # Convert topics to a search query
            topics = ' OR '.join(preferences['topics'])
            params['q'] = topics
        
        print(f"Fetching news with params: {params}")  # Debug print
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"NewsData.io response status: {data.get('status')}")  # Debug print
        
        if data.get('status') == 'success':
            results = data.get('results', [])
            # Filter out articles without description
            results = [article for article in results if article.get('description')]
            return results
        return []
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return []

def summarize_article(article, language='en'):
    if not GEMINI_API_KEY:
        return "No summary available (AI summarization not available)."
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Create a more focused prompt with available content
        content = article.get('description', '')
        if article.get('content'):
            content += "\n" + article.get('content')
            
        prompt = f"""Please provide a detailed, informative summary of this news article in 5-6 lines as if you are explaining it to a 5 year old.\n\nTitle: {article['title']}\nContent: {content}\n\nFocus on the main points, background, and key information. Respond in {language}."""

        # Generate content with safety settings
        response = model.generate_content(
            prompt,
            generation_config={
                'temperature': 0.3,  # Lower temperature for more focused summaries
                'top_p': 0.8,
                'top_k': 40,
                'max_output_tokens': 150,
            }
        )
        
        if response.text:
            return response.text.strip()
        else:
            print(f"Empty response from Gemini for article: {article['title']}")
            return "No summary available."
            
    except Exception as e:
        print(f"Error summarizing article '{article['title']}': {str(e)}")
        return "No summary available."

@app.route('/api/digest', methods=['POST'])
def get_digest():
    try:
        preferences = request.json
        if not preferences:
            return jsonify({"error": "No preferences provided"}), 400
        language = preferences.get('language', 'en')
        articles = fetch_news(preferences)
        if not articles:
            return jsonify({"error": "No articles found. Please check your API keys."}), 404
        digest = {
            'articles': [
                {
                    'title': article['title'],
                    'summary': summarize_article(article, language),
                    'source': article.get('source_id', 'Unknown'),
                    'published_date': article.get('pubDate', ''),
                    'url': article.get('link', ''),
                    'image_url': article.get('image_url', '')  # Added image URL
                }
                for article in articles[:3]  # Limit to 3 articles
            ],
            'timestamp': datetime.now().isoformat()
        }
        return jsonify(digest)
    except Exception as e:
        print(f"Error in get_digest: {str(e)}")  # Added error logging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Server starting...")
    print("Available routes:")
    print("- GET  /")
    print("- GET  /test")
    print("- POST /api/digest")
    app.run(debug=True)