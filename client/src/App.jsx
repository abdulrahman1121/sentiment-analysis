import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch chat history
  useEffect(() => {
    axios.get('http://localhost:5000/api/history')
      .then(response => setHistory(response.data))
      .catch(error => console.error('Error fetching history:', error));
  }, []);

  // Handle text submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage('Please enter some text.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { text });
      setHistory([response.data, ...history]);
      setMessage(`Sentiment: ${response.data.sentiment} (Confidence: ${(response.data.confidence * 100).toFixed(2)}%)`);
      setText('');
    } catch (error) {
      setMessage('Error analyzing sentiment.');
      console.error(error);
    }
  };

  // Prepare data for chart
  const chartData = {
    labels: history.slice(0, 10).reverse().map(item => item.timestamp),
    datasets: [
      {
        label: 'Sentiment Confidence',
        data: history.slice(0, 10).reverse().map(item => item.confidence * (item.sentiment === 'POSITIVE' ? 1 : -1)),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Sentiment Analysis Web App</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border rounded-md"
          />
          <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Analyze
          </button>
        </form>
        {message && <p className="text-lg">{message}</p>}
        <h2 className="text-xl font-semibold mt-4">Chat History</h2>
        <ul className="mt-2 max-h-64 overflow-y-auto">
          {history.map((item, index) => (
            <li key={index} className="border-b py-2">
              <span className="font-medium">{item.text}</span>: {item.sentiment} ({(item.confidence * 100).toFixed(2)}%)
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-4">Sentiment Trend</h2>
        <div className="mt-4">
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
}

export default App;