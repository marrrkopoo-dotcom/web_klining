const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js_v4');
const outDir = path.join(__dirname, 'js');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// Order of inclusion
const files = [
    'components/Notification.js',
    'utils/validation.js',
    'components/Menu.js',
    'components/Modal.js',
    'components/Cart.js',
    'components/FormHandler.js',
    'components/CookieBanner.js',
    'components/PromoModal.js',
    'App.js',
    'main.js'
];

let mergedContent = '';

files.forEach(file => {
    let content = fs.readFileSync(path.join(jsDir, file), 'utf8');
    
    // Remove all import statements
    content = content.replace(/^import\s+.*?from\s+['"].*?['"];?$/gm, '');
    
    // Remove all export keywords
    content = content.replace(/^export\s+/gm, '');
    
    mergedContent += `\n/* --- ${file} --- */\n` + content.trim() + '\n';
});

fs.writeFileSync(path.join(outDir, 'script.js'), mergedContent, 'utf8');
console.log('Merged JS into js/script.js');

// Update HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    // Remove old module script
    content = content.replace(/<script\s+type="module"\s+src="js_v4\/main\.js(\?v=[^"]+)?"><\/script>/gi, '');
    
    // If the dynamic script is not there, add it before </body>
    if (!content.includes('script.src = "js/script.js?v="')) {
        const scriptInjector = `
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = "js/script.js?v=" + new Date().getTime();
      script.defer = true;
      document.body.appendChild(script);
    })();
  </script>
</body>`;
        content = content.replace(/<\/body>/i, scriptInjector);
    }
    
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
});
console.log('Updated HTML files.');
