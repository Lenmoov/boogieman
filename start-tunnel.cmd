@echo off
cd /d "%~dp0"
echo Server starten...
start "Boogie Woogie Studio - server" /min node tools\serve.js 8321
echo.
echo Tunnel starten. Open op de iPad het adres dat hieronder verschijnt (eindigt op trycloudflare.com).
echo Sluit dit venster om de tunnel te stoppen.
echo.
cloudflared tunnel --url http://localhost:8321
