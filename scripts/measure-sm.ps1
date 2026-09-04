Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "images\sethu-logo-black.png"
$img = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = $img.Width
$maxX = 0
$minY = $img.Height
$maxY = 0

for ($y = 0; $y -lt 250; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $img.GetPixel($x, $y)
        if ($p.R -gt 100 -and $p.G -gt 70 -and $p.B -lt 70) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
Write-Host "SM bounds: X=$minX..$maxX (W=$w), Y=$minY..$maxY (H=$h)"
$img.Dispose()
