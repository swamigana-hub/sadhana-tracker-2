Add-Type -AssemblyName System.Drawing

function Resize-Icon {
  param(
    [string]$Src,
    [string]$Dest,
    [int]$Size
  )
  $img = [System.Drawing.Image]::FromFile($Src)
  $side = [Math]::Min($img.Width, $img.Height)
  $cropX = [int](($img.Width - $side) / 2)
  $cropY = [int](($img.Height - $side) / 2)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

  # Inset content ~12% for platform safe-zone (mask/corner crop).
  $inset = [int]($Size * 0.12)
  $drawSize = $Size - (2 * $inset)
  $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $side, $side
  $destRect = New-Object System.Drawing.Rectangle $inset, $inset, $drawSize, $drawSize
  $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

  $bmp.Save($Dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
}

$base = Join-Path $PSScriptRoot '..\public\icons'
$source = Join-Path $base 'sadhguru app icon.png'
Resize-Icon $source (Join-Path $base 'icon-192.png') 192
Resize-Icon $source (Join-Path $base 'icon-512.png') 512
Write-Host 'Created icon-192.png and icon-512.png from square-cropped source with safe-zone inset'
