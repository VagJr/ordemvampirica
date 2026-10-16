const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('.arena-hud {');
console.log('arena-hud CSS at:', idx);
console.log(html.substring(idx, idx + 1800));
