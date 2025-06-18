# News Digest App

A full-stack news aggregation application that provides personalized news digests using AI-powered summaries.

## Features

- **Personalized News**: Get news articles based on your preferred topics
- **AI Summaries**: Each article is summarized using Google's Gemini AI
- **Modern UI**: Clean, responsive React frontend
- **RESTful API**: Flask backend with CORS support
- **Real-time News**: Fetches latest news from NewsData.io API

## Tech Stack

### Backend

- **Python 3.11+**
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Google Generative AI** - Article summarization
- **NewsData.io API** - News data source
- **python-dotenv** - Environment variable management

### Frontend

- **React** - UI framework
- **CSS3** - Styling
- **Fetch API** - HTTP requests

## Prerequisites

- Python 3.11 or higher
- Node.js 14 or higher
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd news-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env file with your API keys
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
NEWSDATA_API_KEY=your_newsdata_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **NewsData.io API Key**:

   - Visit [NewsData.io](https://newsdata.io/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Enable the Gemini API in Google Cloud Console

## Running the Application

### Backend

```bash
cd backend
# Activate virtual environment if not already activated
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /` - Health check
- `GET /test` - Test endpoint
- `POST /api/digest` - Get news digest based on preferences

### Example API Usage

```bash
curl -X POST http://localhost:5000/api/digest \
  -H "Content-Type: application/json" \
  -d '{"topics": ["technology", "science"]}'
```

## Project Structure

```
news-app/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── test_api.py        # API tests
├── frontend/
│   ├── public/            # Static files
│   │   ├── components/    # React components
│   │   │   ├── NewsDigest.js
│   │   │   └── PreferenceForm.js
│   │   └── App.js         # Main App component
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend documentation
├── venv/                  # Python virtual environment
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [NewsData.io](https://newsdata.io/) for providing news data
- [Google Generative AI](https://ai.google.dev/) for AI-powered summaries
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
