@echo off
cd /d "%~dp0"
echo Boogie Woogie Studio draait op http://localhost:8321  (sluit dit venster om te stoppen)
start "" http://localhost:8321
node tools\serve.js 8321
