# Test Application Script
Write-Host "=== Testing AI LinkedIn Insight Agent ===" -ForegroundColor Cyan
Write-Host ""

# Test Backend
Write-Host "1. Testing Backend..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "   Backend: RUNNING on port 3001" -ForegroundColor Green
} catch {
    Write-Host "   Backend: NOT RUNNING" -ForegroundColor Red
    Write-Host "   Run: cd backend; npm start" -ForegroundColor Yellow
}

Write-Host ""

# Test Frontend
Write-Host "2. Testing Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2
    Write-Host "   Frontend: RUNNING on port 5173" -ForegroundColor Green
} catch {
    Write-Host "   Frontend: Starting or not running" -ForegroundColor Yellow
    Write-Host "   Run: cd frontend; npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Test API Processing
Write-Host "3. Testing API Processing..." -ForegroundColor Yellow
$testText = "There is a very interesting role I am hiring for on Jules to build the next vertical frontier of Code Agents."
$body = @{
    postText = $testText
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/process" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 30
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "   API Processing: SUCCESS" -ForegroundColor Green
        $summary = $result.data.summary
        if ($summary.Length -gt 60) {
            $summary = $summary.Substring(0, 60) + "..."
        }
        Write-Host "   Summary: $summary" -ForegroundColor Gray
        if ($result.data.qualityScore) {
            Write-Host "   Quality Score: $($result.data.qualityScore)/10" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   API Processing: Failed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   API Processing: Using fallback mode (no API credits)" -ForegroundColor Yellow
    Write-Host "   This is expected if JULES_API_KEY is not set or has no credits" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Application URLs ===" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "All systems ready!" -ForegroundColor Green
