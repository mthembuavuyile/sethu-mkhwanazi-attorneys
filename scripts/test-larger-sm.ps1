Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "images\sethu-logo-black.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Tight crop of SM from sethu-logo-black.png
$cropX = 114
$cropY = 32
$cropW = 292
$cropH = 192

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

# Background: pitch black #000000
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$g.FillRectangle($bgBrush, 0, 0, $size, $size)
$bgBrush.Dispose()

# Place SM larger (fill ~84% of width: targetW = 430)
$targetW = 430
$targetH = [int]($targetW * ($cropH / $cropW))
$destX = [int](($size - $targetW) / 2)
$destY = [int](($size - $targetH) / 2)

$g.DrawImage($smBmp, $destX, $destY, $targetW, $targetH)
$g.Dispose()
$smBmp.Dispose()

$imagesDir = Resolve-Path "images"
$masterOut = Join-Path $imagesDir "test-sm-large.png"
$outBmp.Save($masterOut, [System.Drawing.Imaging.ImageFormat]::Png)

# Generate 48, 32, 16
foreach ($sz in @(48, 32, 16)) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g2.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g2.DrawImage($outBmp, 0, 0, $sz, $sz)
    $g2.Dispose()
    
    $szOut = Join-Path $imagesDir "test-sm-large-$sz.png"
    $bmp.Save($szOut, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$outBmp.Dispose()
Write-Host "Generated larger SM test files"
