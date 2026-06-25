@echo off
REM ============================================================
REM  Note backend stop (kills the process listening on port 8080)
REM ============================================================
echo [Note] Stopping backend on port 8080 ...
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue; if ($c) { $c.OwningProcess | Select-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force }; Write-Host '[Note] backend stopped.' } else { Write-Host '[Note] no backend running on 8080.' }"
