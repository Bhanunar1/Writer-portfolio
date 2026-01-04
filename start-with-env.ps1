# Sets environment variables for the server and starts it
$Env:EMAIL_USER = "kalkrish153@gmail.com"
$Env:EMAIL_PASS = "nsxk kscm wixa uqjo"
$Env:PORT = "3000"

Write-Host "Environment set. Starting server..." -ForegroundColor Green
npm start
