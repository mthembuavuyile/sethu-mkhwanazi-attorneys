Add-Type -AssemblyName System.Drawing

$masterPath = Resolve-Path "images\test-sm-cropped.png"
$master = [System.Drawing.Image]::FromFile($masterPath)
$imagesDir = Resolve-Path "images"

$sizes = @(16, 32, 48, 180, 192, 512)

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($master, 0, 0, $sz, $sz)
    $g.Dispose()
    
    $out = Join-Path $imagesDir "test-sm-$sz.png"
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated test-sm-$sz.png"
}
$master.Dispose()
