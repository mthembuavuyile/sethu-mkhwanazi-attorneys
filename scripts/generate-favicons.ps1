Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\images\sethu-logo-black.png"
$imagesDir = Join-Path $PSScriptRoot "..\images"
$rootDir = Join-Path $PSScriptRoot ".."

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image loaded: $($srcImg.Width)x$($srcImg.Height)"

# Function to create resized high-quality PNG
function Create-ResizedPng {
    param(
        [System.Drawing.Image]$source,
        [int]$size,
        [string]$outputPath
    )
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($source, 0, 0, $size, $size)
    $g.Dispose()
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outputPath ($size x $size)"
}

# 1. Create standard favicon PNGs
Create-ResizedPng -source $srcImg -size 16 -outputPath (Join-Path $imagesDir "favicon-16x16.png")
Create-ResizedPng -source $srcImg -size 32 -outputPath (Join-Path $imagesDir "favicon-32x32.png")
Create-ResizedPng -source $srcImg -size 48 -outputPath (Join-Path $imagesDir "favicon-48x48.png")
Create-ResizedPng -source $srcImg -size 180 -outputPath (Join-Path $imagesDir "apple-touch-icon.png")
Create-ResizedPng -source $srcImg -size 192 -outputPath (Join-Path $imagesDir "android-chrome-192x192.png")
Create-ResizedPng -source $srcImg -size 512 -outputPath (Join-Path $imagesDir "android-chrome-512x512.png")

# Also copy apple-touch-icon to root
Copy-Item (Join-Path $imagesDir "apple-touch-icon.png") (Join-Path $rootDir "apple-touch-icon.png") -Force

# 2. Build multi-resolution ICO file (16, 32, 48)
function Create-IcoFile {
    param(
        [System.Drawing.Image]$source,
        [string]$outputPath
    )
    $sizes = @(16, 32, 48)
    $msList = New-Object System.Collections.Generic.List[System.IO.MemoryStream]
    
    foreach ($sz in $sizes) {
        $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.DrawImage($source, 0, 0, $sz, $sz)
        $g.Dispose()
        
        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        $msList.Add($ms)
    }
    
    $fs = [System.IO.File]::Create($outputPath)
    $bw = New-Object System.IO.BinaryWriter($fs)
    
    # ICONDIR header
    $bw.Write([uint16]0) # Reserved
    $bw.Write([uint16]1) # Type 1 = ICO
    $bw.Write([uint16]$sizes.Count) # Count of images
    
    $offset = 6 + ($sizes.Count * 16)
    
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $sz = $sizes[$i]
        $bytes = $msList[$i].ToArray()
        
        # ICONDIRENTRY
        $bw.Write([byte]$sz) # Width (48, 32, 16)
        $bw.Write([byte]$sz) # Height
        $bw.Write([byte]0)   # Color palette
        $bw.Write([byte]0)   # Reserved
        $bw.Write([uint16]1) # Color planes
        $bw.Write([uint16]32)# Bits per pixel
        $bw.Write([uint32]$bytes.Length) # Image size in bytes
        $bw.Write([uint32]$offset)       # File offset
        
        $offset += $bytes.Length
    }
    
    # Write image data
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $bytes = $msList[$i].ToArray()
        $bw.Write($bytes)
        $msList[$i].Dispose()
    }
    
    $bw.Flush()
    $bw.Close()
    $fs.Close()
    Write-Host "Created ICO: $outputPath"
}

Create-IcoFile -source $srcImg -outputPath (Join-Path $rootDir "favicon.ico")
Copy-Item (Join-Path $rootDir "favicon.ico") (Join-Path $imagesDir "favicon.ico") -Force

# 3. Create 1200x630 Social Share Open Graph Image (og-image.jpg and og-image.png)
function Create-OgBanner {
    param(
        [System.Drawing.Image]$logoImg,
        [string]$outputJpg,
        [string]$outputPng
    )
    $width = 1200
    $height = 630
    $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    
    # Luxury dark background: #0c0d12
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 13, 18))
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)
    $bgBrush.Dispose()
    
    # Subtle inner gold border (refined luxury aesthetic)
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 197, 160, 89), 1) # #c5a059
    $g.DrawRectangle($goldPen, 24, 24, $width - 48, $height - 48)
    $goldPen.Dispose()
    
    # Subtle secondary accent line
    $innerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 197, 160, 89), 1)
    $g.DrawRectangle($innerPen, 32, 32, $width - 64, $height - 64)
    $innerPen.Dispose()
    
    # Logo placement in the center safe zone
    # Safe zone is 520x520 in center
    $logoSize = 480
    $logoX = [int](($width - $logoSize) / 2)
    $logoY = [int](($height - $logoSize) / 2)
    
    $g.DrawImage($logoImg, $logoX, $logoY, $logoSize, $logoSize)
    
    $g.Dispose()
    
    # Save PNG
    $bmp.Save($outputPng, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Save optimized JPEG (quality = 90, ensures under 200KB for WhatsApp)
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)
    $bmp.Save($outputJpg, $encoder, $encoderParams)
    
    $bmp.Dispose()
    Write-Host "Created Social Share Images: $outputJpg and $outputPng"
}

Create-OgBanner -logoImg $srcImg -outputJpg (Join-Path $imagesDir "og-image.jpg") -outputPng (Join-Path $imagesDir "og-image.png")

$srcImg.Dispose()
Write-Host "All assets generated successfully!"
