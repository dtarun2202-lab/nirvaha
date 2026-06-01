@echo off
echo ================================
echo Starting Nirvaha Application
echo ================================
echo.
echo [IMPORTANT] Before running:
echo 1. Update backend\.env with your MongoDB Atlas connection string
echo 2. Make sure all npm packages are installed
echo.
pause
echo.
echo [1/2] Starting Backend Server...
start "Nirvaha Backend" cmd /k "cd backend && npm start"
echo.
timeout /t 5
echo.
echo [2/2] Starting Frontend Application...
start "Nirvaha Frontend" cmd /k "cd frontend && npm start"
echo.
echo ================================
echo All services are starting!
echo ================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 or http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
