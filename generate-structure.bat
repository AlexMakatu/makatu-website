@echo off
echo Generating clean structure...

powershell -Command "Get-ChildItem app,components,sanity -Recurse -File | Where-Object { $_.Name -notmatch '_2026' } | Select-Object FullName | Out-File structure-final.txt"

echo Done!
pause