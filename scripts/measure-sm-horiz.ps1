Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "images\sethu-mkhwanazi-horizontal-transparent-logo.png"
$img = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = $img.Width
$maxX = 0
$minY = $img.Height
$maxY = 0

for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt 500; $x++) {
        $p = $img.GetPixel($x, $y)
        if ($p.A -gt 30 -and $p.R -gt 100 -and $p.G -gt 70) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
Write-Host "Horizontal logo SM bounds: X=$minX..$maxX (W=$w), Y=$minY..$maxY (H=$h)"
$img.Dispose()
