# Check MongoDB service
Write-Host "Checking MongoDB service..." -ForegroundColor Cyan
try {
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction Stop
    Write-Host "Status: $($mongoService.Status)" -ForegroundColor $(if ($mongoService.Status -eq 'Running') { 'Green' } else { 'Yellow' })
    if ($mongoService.Status -ne 'Running') {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Service MongoDB
    }
} catch {
    Write-Host "MongoDB service not found. Please install MongoDB." -ForegroundColor Red
}

# Check Memurai (Redis) service
Write-Host "`nChecking Memurai (Redis) service..." -ForegroundColor Cyan
try {
    $memuraiService = Get-Service -Name "Memurai" -ErrorAction Stop
    Write-Host "Status: $($memuraiService.Status)" -ForegroundColor $(if ($memuraiService.Status -eq 'Running') { 'Green' } else { 'Yellow' })
    if ($memuraiService.Status -ne 'Running') {
        Write-Host "Starting Memurai..." -ForegroundColor Yellow
        Start-Service Memurai
    }
} catch {
    Write-Host "Memurai service not found. Please install Memurai." -ForegroundColor Red
}

# Test connections
Write-Host "`nTesting network connections..." -ForegroundColor Cyan
$mongoTest = Test-NetConnection localhost -Port 27017 -WarningAction SilentlyContinue
$redisTest = Test-NetConnection localhost -Port 6379 -WarningAction SilentlyContinue

Write-Host "MongoDB (27017): " -NoNewline
if ($mongoTest.TcpTestSucceeded) {
    Write-Host "Connected" -ForegroundColor Green
} else {
    Write-Host "Not Connected" -ForegroundColor Red
}

Write-Host "Redis (6379): " -NoNewline
if ($redisTest.TcpTestSucceeded) {
    Write-Host "Connected" -ForegroundColor Green
} else {
    Write-Host "Not Connected" -ForegroundColor Red
}
