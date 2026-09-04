Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "images\sethu-mkhwanazi-horizontal-transparent-logo.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# We know SM is X=0..471, Y=5..311
$smWidth = 472
$smHeight = 307

# Crop SM to a separate bitmap
$smBmp = New-Object System.Drawing.Bitmap($smWidth, $smHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$smG = [System.Drawing.Graphics]::FromImage($smBmp)
$smG.DrawImage($src, 0, 0, (New-Object System.Drawing.Rectangle(0, 5, $smWidth, $smHeight)), [System.Drawing.GraphicsUnit]::Pixel)
$smG.Dispose()
$src.Dispose()

# Create 512x512 Master Favicon
# We can test a dark tile (#0c0d12) with subtle rounded corner or circle or solid
$size = 512
$outBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Background: Luxury dark circle or rounded square
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 13, 18))
$g.FillRectangle($bgBrush, 0, 0, $size, $size)
$bgBrush.Dispose()

# Subtle gold rim
$rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 197, 160, 89), 6)
$g.DrawRectangle($rimPen, 10, 10, $size - 20, $size - 20)
$rimPen.Dispose()

# Target fit for SM monogram: target width around 400px, aspect ratio 472:307
$targetW = 400
$targetH = [int]($targetW * ($smHeight / $smWidth))
$x = [int](($size - $targetW) / 2)
$y = [int](($size - $targetH) / 2)

$g.DrawImage($smBmp, $x, $y, $targetW, $targetH)
$g.Dispose()
$smBmp.Dispose()

$testPath = Resolve-Path "images"
$outPath = Join-Path $testPath "test-sm-favicon.png"
$outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()
Write-Host "Test favicon generated at $outPath"
