@echo off
echo ===================================================
echo Starting PostgreSQL 18 Server...
echo ===================================================
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\Program Files\PostgreSQL\18\data" -l "C:\Program Files\PostgreSQL\18\data\server.log"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo PostgreSQL server is running!
) else (
    echo.
    echo PostgreSQL is already running or encountered an issue. Checking status...
    "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" status -D "C:\Program Files\PostgreSQL\18\data"
)
echo.
pause
