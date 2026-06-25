@echo off
REM ============================================================
REM  Note 백엔드 시작 (Spring Boot, 포트 8080)
REM  이 창을 닫거나 Ctrl+C 하면 백엔드가 종료됩니다.
REM ============================================================
cd /d "%~dp0Backend"
echo [Note] 백엔드를 시작합니다 (http://localhost:8080) ...
call gradlew.bat bootRun
