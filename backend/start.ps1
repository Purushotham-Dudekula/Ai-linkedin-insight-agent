# PowerShell script to start the backend server
# This script will kill any existing process on port 3001 and start the server

Write-Host "Starting LinkedIn Insight Agent Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if port 3001 is in use
$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "WARNING: Port 3001 is already in use. Stopping existing processes..." -ForegroundColor Yellow
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processes) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "   OK - Stopped process $processId" -ForegroundColor Green
        } catch {
            Write-Host "   WARNING - Could not stop process $processId" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Seconds 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your JULES_API_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS - Starting server on port 3001..." -ForegroundColor Green
Write-Host ""

# Start the server
npm start
