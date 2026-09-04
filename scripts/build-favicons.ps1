Add-Type -AssemblyName System.Drawing

$masterPath = Resolve-Path "images\test-sm-large.png"
$master = [System.Drawing.Bitmap]::FromFile($masterPath)
$imagesDir = Resolve-Path "images"
$rootDir = Resolve-Path "."

Write-Host "Master image loaded from $masterPath ($($master.Width)x$($master.Height))"

function Create-Png {
    param([int]$sz, [string]$outPath)
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($master, 0, 0, $sz, $sz)
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created PNG: $outPath ($sz x $sz)"
}

# 1. Generate Favicon PNGs
Create-Png -sz 16 -outPath (Join-Path $imagesDir "favicon-16x16.png")
Create-Png -sz 32 -outPath (Join-Path $imagesDir "favicon-32x32.png")
Create-Png -sz 48 -outPath (Join-Path $imagesDir "favicon-48x48.png")
Create-Png -sz 180 -outPath (Join-Path $imagesDir "apple-touch-icon.png")
Create-Png -sz 192 -outPath (Join-Path $imagesDir "android-chrome-192x192.png")
Create-Png -sz 512 -outPath (Join-Path $imagesDir "android-chrome-512x512.png")

# Also copy apple-touch-icon.png to root
Copy-Item (Join-Path $imagesDir "apple-touch-icon.png") (Join-Path $rootDir "apple-touch-icon.png") -Force

# 2. Build multi-resolution ICO file (16, 32, 48)
$sizes = @(16, 32, 48)
$msList = New-Object System.Collections.Generic.List[System.IO.MemoryStream]

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($master, 0, 0, $sz, $sz)
    $g.Dispose()
    
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $msList.Add($ms)
}

function Write-IcoFile([string]$outputPath) {
    $fs = [System.IO.File]::Create($outputPath)
    $bw = New-Object System.IO.BinaryWriter($fs)
    
    # ICONDIR
    $bw.Write([uint16]0) # Reserved
    $bw.Write([uint16]1) # ICO type
    $bw.Write([uint16]$sizes.Count)
    
    $offset = 6 + ($sizes.Count * 16)
    
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $sz = $sizes[$i]
        $bytes = $msList[$i].ToArray()
        
        $bw.Write([byte]$sz)
        $bw.Write([byte]$sz)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$bytes.Length)
        $bw.Write([uint32]$offset)
        
        $offset += $bytes.Length
    }
    
    for ($i = 0; $i -lt $sizes.Count; $i++) {
        $bytes = $msList[$i].ToArray()
        $bw.Write($bytes)
    }
    
    $bw.Flush()
    $bw.Close()
    $fs.Close()
    Write-Host "Created ICO: $outputPath"
}

Write-IcoFile (Join-Path $rootDir "favicon.ico")
Write-IcoFile (Join-Path $imagesDir "favicon.ico")

foreach ($ms in $msList) {
    $ms.Dispose()
}
$master.Dispose()

Write-Host "All favicon files built successfully!"
