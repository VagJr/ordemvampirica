const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('class="btn-heal-combat"', 'id="btn-heal-combat" class="btn-heal-combat"');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Added id="btn-heal-combat"');
