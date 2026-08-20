Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path "assets\images" -Filter "*.png"
foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($bytes[0] -ne 0x89 -or $bytes[1] -ne 0x50) {
        Write-Host "Converting JPEG to PNG: $($f.Name)"
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        $temp = $f.FullName + ".tmp.png"
        $img.Save($temp, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        Move-Item -Force $temp $f.FullName
        Write-Host "Successfully converted: $($f.Name)"
    } else {
        Write-Host "Valid PNG: $($f.Name)"
    }
}
