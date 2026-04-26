$base='http://localhost:49357'
$html=(Invoke-WebRequest $base -UseBasicParsing).Content
$matches = [regex]::Matches($html,@"(?:\./|/)?assets/[^\"'\s>]+"@) | ForEach-Object { $_.Value } | Select-Object -Unique
if (-not $matches) { Write-Host 'No assets found'; exit 0 }
foreach ($m in $matches) {
  $rel = $m -replace '^\./',''
  $url = $base.TrimEnd('/') + '/' + $rel.TrimStart('/')
  try {
    $h = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -ErrorAction Stop
    $ct=$h.Headers['Content-Type']
    $cl=$h.Headers['Content-Length']
    Write-Host "$url`tStatus:$($h.StatusCode)`tCT:$ct`tLen:$cl"
  } catch {
    Write-Host "$url`tERROR: $($_.Exception.Message)"
  }
}
