Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "images\sethu-logo-black.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Crop bounds from sethu-logo-black.png:
# X: 110 to 410 (W=300)
# Y: 30 to 225 (H=195)
$cropX = 110
$cropY = 30
$cropW = 300
$cropH = 196

$smBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$smG = [System.Drawing.Graphics]::FromImage($smBmp)
$smG.DrawImage($src, 0, 0, (New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
$smG.Dispose()
$src.Dispose()

$size = 512
$outBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Background: pitch black #000000 matching original logo
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$g.FillRectangle($bgBrush, 0, 0, $size, $size)
$bgBrush.Dispose()

# Optional subtle gold border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 197, 160, 89), 8)
$g.DrawRectangle($borderPen, 16, 16, $size - 32, $size - 32)
$borderPen.Dispose()

# Place SM in center with perfect padding
$targetW = 380
$targetH = [int]($targetW * ($cropH / $cropW))
$destX = [int](($size - $targetW) / 2)
$destY = [int](($size - $targetH) / 2)

$g.DrawImage($smBmp, $destX, $destY, $targetW, $targetH)
$g.Dispose()
$smBmp.Dispose()

$outPath = Join-Path (Resolve-Path "images") "test-sm-cropped.png"
$outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()
Write-Host "Cropped SM saved to $outPath"
