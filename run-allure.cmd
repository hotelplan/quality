@echo off

REM Get the short (8.3) path of the current script's directory
REM This is necessary because long paths or paths with spaces (e.g., "C:\Users\Cloud Employee")
REM can cause issues when running commands like 'npx allure serve'. The short path ensures compatibility.
REM Example: "C:\Users\Cloud Employee" becomes "C:\Users\CLOUDE~1"
for %%I in ("%~dp0") do set SHORT_PATH=%%~sI

REM Change the working directory to the script's directory
REM This ensures that the 'allure-results' directory is found in the correct location.
REM Example: Changes directory to "C:\Users\CLOUDE~1\Documents\Development\quality"
cd /d %SHORT_PATH%

REM Start the Allure server to view test results
npx allure serve allure-results