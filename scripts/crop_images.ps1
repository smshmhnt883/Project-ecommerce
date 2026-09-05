Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\somes\.gemini\antigravity\brain\2cb3e566-6943-44ef-9c8a-461960c5072c\.user_uploaded\media_1788615898299.jpg"
$outDir = "C:\Users\somes\.gemini\antigravity\scratch\patanjali-store\public\products"

$src = [System.Drawing.Bitmap]::new($srcPath)
$w = $src.Width
$h = $src.Height

# We have 5 columns and 2 rows
# Find vertical dividers by looking for solid white columns
# Find horizontal divider by looking for solid white row
Write-Output "Source Dimensions: $w x $h"

# 5 columns across 1024: roughly widths of 204 each
# Let's define exact bounding boxes for the 10 items
# Looking at 1024 width / 5 cols:
# col 0: 0 to 204
# col 1: 205 to 409
# col 2: 410 to 614
# col 3: 615 to 819
# col 4: 820 to 1023
# row 0: 0 to 340
# row 1: 341 to 681

$cols = @(
    @{ start = 0; width = 204 },
    @{ start = 205; width = 204 },
    @{ start = 410; width = 204 },
    @{ start = 615; width = 204 },
    @{ start = 820; width = 204 }
)

$rows = @(
    @{ start = 0; height = 340 },
    @{ start = 342; height = 340 }
)

$products = @(
    @{ row = 0; col = 0; name = "patanjali-dant-kanti.jpg"; title = "Dant Kanti Natural Toothpaste" },
    @{ row = 0; col = 1; name = "patanjali-kesh-kanti-aloe-vera.jpg"; title = "Kesh Kanti Aloe Vera Hair Cleanser" },
    @{ row = 0; col = 2; name = "patanjali-aloe-vera-gel.jpg"; title = "Patanjali Aloe Vera Gel" },
    @{ row = 0; col = 3; name = "patanjali-honey.jpg"; title = "Patanjali 100% Pure Honey" },
    @{ row = 0; col = 4; name = "patanjali-cow-ghee.jpg"; title = "Patanjali Pure Cow Desi Ghee" },
    @{ row = 1; col = 0; name = "patanjali-whole-wheat-atta.jpg"; title = "Patanjali Whole Wheat Atta" },
    @{ row = 1; col = 1; name = "patanjali-chyawanprash.jpg"; title = "Patanjali Special Chyawanprash" },
    @{ row = 1; col = 2; name = "patanjali-giloy-ghan-vati.jpg"; title = "Divya Giloy Ghan Vati" },
    @{ row = 1; col = 3; name = "patanjali-herbal-hand-wash.jpg"; title = "Patanjali Herbal Hand Wash" },
    @{ row = 1; col = 4; name = "patanjali-gulab-jal.jpg"; title = "Patanjali Gulab Jal Rose Water" }
)

foreach ($p in $products) {
    $c = $cols[$p.col]
    $r = $rows[$p.row]

    $rect = [System.Drawing.Rectangle]::new($c.start, $r.start, $c.width, $r.height)
    $cropped = $src.Clone($rect, $src.PixelFormat)

    $destPath = Join-Path $outDir $p.name
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Output "Saved $($p.title) to $($p.name) (Size: $($c.width)x$($r.height))"
}

$src.Dispose()
Write-Output "All 10 authentic Patanjali product images cropped successfully."
