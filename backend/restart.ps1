# PowerShell script to restart the backend server
# This will kill any existing process and start fresh

Write-Host "Restarting backend server..." -ForegroundColor Cyan
Write-Host ""

# Kill any process on port 3001
$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($connections) {
    Write-Host "Stopping existing server..." -ForegroundColor Yellow
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processes) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
npm start

