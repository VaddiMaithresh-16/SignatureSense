#!/bin/bash

# Start Flask API server for image comparison
# This server runs on port 7777 and handles signature verification

echo "🚀 Starting Flask API server on port 7777..."

# Activate virtual environment if it exists
if [ -d "sv-venv" ]; then
    echo "📦 Activating virtual environment..."
    source sv-venv/bin/activate
fi

# Check if model weights file exists
if [ ! -f "model_weights33.h5" ]; then
    echo "⚠️  Warning: model_weights33.h5 not found!"
    echo "   The server will start but verification may fail."
fi

# Start Flask server
echo "🌐 Flask server starting..."
python3 model_predict.py
