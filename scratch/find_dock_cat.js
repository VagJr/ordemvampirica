const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('.dock-category {');
console.log('.dock-category at', idx);
if (idx !== -1) {
    console.log(html.substring(idx, idx + 1000));
}
