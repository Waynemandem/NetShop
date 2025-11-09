# --- Start NetShop locally and expose it via Cloudflare ---

# Navigate to your NetShop folder
cd "$PSScriptRoot\NetShop"

# Start Live Server (or replace with your dev server command)
Start-Process powershell -ArgumentList "live-server --port=5500" -NoNewWindow

# Wait for server to start
Start-Sleep -Seconds 5

# Create a Cloudflare tunnel to your local server
cloudflared tunnel --url http://127.0.0.1:5500
