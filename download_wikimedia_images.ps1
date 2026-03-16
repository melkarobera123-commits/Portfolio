$ErrorActionPreference = 'Stop'
$files = @(
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Pestle%20and%20mortar.jpg'; Out = 'images/aspirin-hero.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bayer-Tablets%20of%20Aspirin%20ad%201918.png'; Out = 'images/aspirin-inline.png' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Penicillium%20glabrum%20conidiophores.jpg'; Out = 'images/penicillin-hero.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Penicillin%20O.svg'; Out = 'images/penicillin-inline.svg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Vaccination.jpg'; Out = 'images/vaccine-hero.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Smallpox%20vaccination%20needle.jpg'; Out = 'images/vaccine-inline.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Apothecary%20Shop,%20Interior%202.jpg'; Out = 'images/myths-hero.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Stewart%27s%20Pharmacy%20interior,%20ca%201900%20(SEATTLE%20282).jpg'; Out = 'images/myths-inline.jpg' },
  @{ Url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Apothecary%20Shop,%20Interior%201.jpg'; Out = 'images/about.jpg' }
)

$headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }

foreach ($f in $files) {
  $outPath = Join-Path $PSScriptRoot $f.Out
  if (Test-Path $outPath) { continue }
  $success = $false
  $delays = @(5, 10, 20, 40)
  foreach ($delay in $delays) {
    try {
      Invoke-WebRequest -Uri $f.Url -OutFile $outPath -Headers $headers
      $success = $true
      break
    } catch {
      Start-Sleep -Seconds $delay
    }
  }
  if (-not $success) {
    Write-Warning "Failed to download $($f.Url). Try again later."
  }
}
