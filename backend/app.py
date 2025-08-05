from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize sentiment analyzer
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Initialize SQLite database
DB_PATH = "chat_history.db"
def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE chats (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, sentiment TEXT, confidence REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()
        conn.close()

init_db()

@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Analyze sentiment
    result = sentiment_analyzer(text)[0]
    sentiment = result['label']
    confidence = result['score']
    
    # Store in database
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO chats (text, sentiment, confidence) VALUES (?, ?, ?)", (text, sentiment, confidence))
    conn.commit()
    conn.close()
    
    return jsonify({
        'text': text,
        'sentiment': sentiment,
        'confidence': confidence
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT text, sentiment, confidence, timestamp FROM chats ORDER BY timestamp DESC")
    history = [{'text': row[0], 'sentiment': row[1], 'confidence': row[2], 'timestamp': row[3]} for row in c.fetchall()]
    conn.close()
    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True, port=5000)