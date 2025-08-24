@echo off
echo YKFA Website Image Downloader
echo =============================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Install requirements if needed
echo Installing required packages...
pip install -r requirements.txt

echo.
echo Starting image download...
echo.

REM Run the image downloader with the config file
python image_downloader.py --config ykfa_images_config.json

echo.
echo Download completed!
pause