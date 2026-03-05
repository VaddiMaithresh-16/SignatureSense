@echo off
REM Start Flask API server for image comparison
REM This server runs on port 7777 and handles signature verification

echo Starting Flask API server on port 7777...

REM Activate virtual environment if it exists
if exist "sv-venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call sv-venv\Scripts\activate.bat
)

REM Check if model weights file exists
if not exist "model_weights33.h5" (
    echo Warning: model_weights33.h5 not found!
    echo The server will start but verification may fail.
)

REM Start Flask server
echo Flask server starting...
python model_predict.py

pause
