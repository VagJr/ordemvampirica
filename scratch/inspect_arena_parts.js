const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('arena-top-hud');
console.log('arena-top-hud at char:', idx);
console.log(html.substring(idx - 100, idx + 1800));
