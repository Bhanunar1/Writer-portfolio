@echo off
echo Installing dependencies...
cd /d "%~dp0"
call npm install
if %errorlevel% equ 0 (
    echo.
    echo Dependencies installed successfully!
    echo.
    echo You can now start the server with: npm start
) else (
    echo.
    echo Installation failed. Please check the error messages above.
    pause
)
