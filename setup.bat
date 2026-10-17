@echo off
title PROJECT V — Setup
color 0A
cls

echo.
echo  ============================================================
echo   PROJECT V — Luxury Automotive Launch Platform
echo   Auto Setup Script for Windows
echo  ============================================================
echo.

:: Check if Node.js is installed
echo  [1/4] Checking Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [ERROR] Node.js is NOT installed!
    echo.
    echo  Please install Node.js from: https://nodejs.org
    echo  Choose the LTS version, then run this file again.
    echo.
    pause
    start https://nodejs.org/en/download
    exit /b 1
) ELSE (
    FOR /F "tokens=*" %%i IN ('node -v') DO echo  Node.js found: %%i
)

:: Check npm
echo.
echo  [2/4] Checking npm...
npm -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] npm not found. Please reinstall Node.js.
    pause
    exit /b 1
) ELSE (
    FOR /F "tokens=*" %%i IN ('npm -v') DO echo  npm found: %%i
)

:: Install dependencies
echo.
echo  [3/4] Installing project dependencies...
echo  (This may take 1-2 minutes on first run)
echo.
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
)
echo.
echo  Dependencies installed successfully!

:: Start dev server
echo.
echo  [4/4] Starting development server...
echo.
echo  ============================================================
echo   Server starting at: http://localhost:3000/
echo   (If port 3000 is busy, try: http://localhost:3001/)
echo.
echo   Press CTRL+C to stop the server
echo  ============================================================
echo.

:: Open browser after 3 second delay (in background)
start /b cmd /c "timeout /t 3 >nul && start http://localhost:3000/"

npm run dev

pause
