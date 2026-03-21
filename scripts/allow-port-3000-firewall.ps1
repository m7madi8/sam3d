# Run this script as Administrator to allow phone/tablet to open the dev server.
# Right-click PowerShell -> Run as Administrator, then:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
#   & "c:\Users\eslam\Desktop\My projects\sam3d\scripts\allow-port-3000-firewall.ps1"

$ruleName = "Next.js Dev (Port 3000)"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Rule already exists. Removing to recreate..."
  Remove-NetFirewallRule -DisplayName $ruleName
}
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
Write-Host "Done. Port 3000 is now allowed. Try opening from your phone: http://YOUR_PC_IP:3000"
