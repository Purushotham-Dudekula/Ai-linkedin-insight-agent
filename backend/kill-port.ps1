# PowerShell script to kill process using port 3001
# Usage: .\kill-port.ps1 [port_number]

param(
    [int]$Port = 3001
)

Write-Host "Checking for processes using port $Port..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($connections) {
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    Write-Host "WARNING: Found processes using port $Port" -ForegroundColor Red
    foreach ($processId in $processes) {
        $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "   - PID: $processId | Name: $($proc.ProcessName)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Stopping processes..." -ForegroundColor Yellow
    foreach ($processId in $processes) {
        try {
            Stop-Process -Id $processId -Force
            Write-Host "   OK - Stopped process $processId" -ForegroundColor Green
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Host "   ERROR - Failed to stop process $processId : $errorMsg" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "SUCCESS - Port $Port is now free!" -ForegroundColor Green
} else {
    Write-Host "SUCCESS - Port $Port is already free!" -ForegroundColor Green
}
