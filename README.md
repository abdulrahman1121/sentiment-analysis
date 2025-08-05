Sentiment Analysis Web App
A full-stack web application that uses DistilBERT to analyze the sentiment of user input, stores chat history in SQLite, and visualizes sentiment trends with Chart.js.
Features

Sentiment Analysis: Classifies text as Positive or Negative using DistilBERT.
Chat History: Stores user inputs and sentiments in a SQLite database.
Sentiment Trends: Visualizes sentiment confidence over time with a line chart.
Responsive UI: Built with React and Tailwind CSS for a modern, user-friendly interface.

Tech Stack

Frontend: React, Vite, Tailwind CSS, Chart.js
Backend: Flask, Python, DistilBERT (Hugging Face Transformers)
Database: SQLite
Tools: Git, VS Code

Setup

Clone the repository:
git clone https://github.com/abdulrahman1121/sentiment-analysis
cd sentiment-web-app


Backend Setup:

Create and activate a virtual environment:python -m venv venv
.\venv\Scripts\activate


Install dependencies:pip install -r requirements.txt


Run the Flask app:python backend/app.py




Frontend Setup:

Navigate to the client folder:cd client


Install dependencies:npm install


Run the React app:npm run dev




Access the App:

Open http://localhost:5173 in your browser.
Enter text to analyze sentiment, view history, and see trends.



Usage

Type a message and click "Analyze" to get sentiment results.
View past messages and their sentiments in the chat history.
Observe sentiment trends in the line chart.

Future Improvements

Add neutral sentiment detection using a more advanced model.
Implement user authentication for personalized history.
Deploy to a cloud platform like GCP or Heroku.
