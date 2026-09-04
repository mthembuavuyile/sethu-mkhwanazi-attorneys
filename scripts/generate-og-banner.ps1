Add-Type -AssemblyName System.Drawing

$logoPath = Resolve-Path "images\sethu-logo-black.png"
$logo = [System.Drawing.Bitmap]::FromFile($logoPath)

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# 1. Background: Pure black #000000 (seamless match with logo)
$g.Clear([System.Drawing.Color]::Black)

# 2. Refined Luxury Gold Borders
# Outer border
$goldColor1 = [System.Drawing.Color]::FromArgb(180, 197, 160, 89) # #C5A059
$pen1 = New-Object System.Drawing.Pen($goldColor1, 2)
$g.DrawRectangle($pen1, 30, 30, $width - 60, $height - 60)
$pen1.Dispose()

# Inner hairline border
$goldColor2 = [System.Drawing.Color]::FromArgb(80, 197, 160, 89)
$pen2 = New-Object System.Drawing.Pen($goldColor2, 1)
$g.DrawRectangle($pen2, 38, 38, $width - 76, $height - 76)
$pen2.Dispose()

# 3. Draw corner corner accent brackets
$bracketPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 197, 160, 89), 3)
$bracketLen = 30
# Top-Left
$g.DrawLine($bracketPen, 24, 24, 24 + $bracketLen, 24)
$g.DrawLine($bracketPen, 24, 24, 24, 24 + $bracketLen)
# Top-Right
$g.DrawLine($bracketPen, $width - 24, 24, $width - 24 - $bracketLen, 24)
$g.DrawLine($bracketPen, $width - 24, 24, $width - 24, 24 + $bracketLen)
# Bottom-Left
$g.DrawLine($bracketPen, 24, $height - 24, 24 + $bracketLen, $height - 24)
$g.DrawLine($bracketPen, 24, $height - 24, 24, $height - 24 - $bracketLen)
# Bottom-Right
$g.DrawLine($bracketPen, $width - 24, $height - 24, $width - 24 - $bracketLen, $height - 24)
$g.DrawLine($bracketPen, $width - 24, $height - 24, $width - 24, $height - 24 - $bracketLen)
$bracketPen.Dispose()

# 4. Center the logo perfectly in the safe zone
# In 630 height, logo at 500x500 gives 65px top/bottom padding
$logoSize = 500
$logoX = [int](($width - $logoSize) / 2)
$logoY = [int](($height - $logoSize) / 2)

$g.DrawImage($logo, $logoX, $logoY, $logoSize, $logoSize)

$g.Dispose()
$logo.Dispose()

$imagesDir = Resolve-Path "images"
$outPng = Join-Path $imagesDir "og-image.png"
$outJpg = Join-Path $imagesDir "og-image.jpg"

$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Save high quality JPEG (~150-200KB, perfect for WhatsApp <300KB constraint)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
$bmp.Save($outJpg, $encoder, $encoderParams)

$bmp.Dispose()

$pngSize = (Get-Item $outPng).Length
$jpgSize = (Get-Item $outJpg).Length
Write-Host "Generated og-image.png ($pngSize bytes) and og-image.jpg ($jpgSize bytes)"
