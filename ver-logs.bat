@echo off
echo Monitoreando logs de Laravel...
echo Presiona Ctrl+C para detener
echo.
:loop
cls
type storage\logs\lararavel.log
timeout /t 2 >nul
goto loop