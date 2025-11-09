# --- Start NetShop locally and expose it via Cloudflare ---

# 1. Navigate to your project folder
cd "$PSScriptRoot\NetShop"

# 2. Start your Live Server (change this if you use another dev server)
Start-Process powershell -ArgumentList "live-server --port=5500" -NoNewWindow

# 3. Wait a few seconds for the local server to boot
Start-Sleep -Seconds 5

# 4. Create a Cloudflare tunnel to your local site
cloudflared tunnel --url http://127.0.0.1:5500
