#!/bin/bash

# Start both Flask API and Node.js backend servers

echo "🚀 Starting Signature Verification Services..."
echo ""

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Start Flask server in background
echo "📡 Starting Flask API server (port 7777)..."
if [ -d "sv-venv" ]; then
    source sv-venv/bin/activate
fi

# Start Flask in background
python3 model_predict.py > flask.log 2>&1 &
FLASK_PID=$!

# Wait for Flask to start
echo "⏳ Waiting for Flask server to start..."
sleep 5

# Check if Flask is running
if curl -s http://localhost:7777 > /dev/null 2>&1; then
    echo "✅ Flask server is running (PID: $FLASK_PID)"
else
    echo "⚠️  Flask server may not be ready yet. Check flask.log for details."
fi

echo ""
echo "🌐 Starting Node.js backend server (port 5051)..."
echo ""

# Start Node.js server
npm start

# Cleanup on exit
trap "kill $FLASK_PID 2>/dev/null" EXIT
