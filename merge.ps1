$jsDir = "js_v4"
$outDir = "js"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$files = @(
    "components\Notification.js",
    "utils\validation.js",
    "components\Menu.js",
    "components\Modal.js",
    "components\Cart.js",
    "components\FormHandler.js",
    "components\CookieBanner.js",
    "components\PromoModal.js",
    "App.js",
    "main.js"
)

$mergedContent = ""

foreach ($file in $files) {
    $path = Join-Path $jsDir $file
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    
    # Remove imports (simple regex)
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^import\s+.*?from\s+[''"].*?[''"];?$', '')
    # Remove exports
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^export\s+', '')
    
    $mergedContent += "`n/* --- $file --- */`n" + $content.Trim() + "`n"
}

[System.IO.File]::WriteAllText((Join-Path $outDir "script.js"), $mergedContent, [System.Text.Encoding]::UTF8)

# Update HTML files
$htmlFiles = Get-ChildItem -Filter *.html
$scriptInjector = @"
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = "js/script.js?v=" + new Date().getTime();
      script.defer = true;
      document.body.appendChild(script);
    })();
  </script>
</body>
"@

foreach ($f in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?i)<script\s+type="module"\s+src="js_v4/main\.js(\?v=[^"]+)?"></script>', '')
    
    if (-not $content.Contains('script.src = "js/script.js?v="')) {
        $content = $content.Replace('</body>', $scriptInjector)
    }
    
    [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
}
Write-Output "Done"
