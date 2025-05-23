# backend/app.py
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes import api_bp # Import the blueprint

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all origins and all routes. In a real app, specify origins.
CORS(app)

# Register the API blueprint
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return "Flask Backend is running! Go to /api/message or /api/chatbot (POST)."

if __name__ == '__main__':
    # Use a higher port for backend to avoid conflict with React's default 3000
    app.run(debug=True, port=5000)