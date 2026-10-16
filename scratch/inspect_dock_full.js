const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="desktop-nav-dock"');
const end = html.indexOf('</aside>', start);
console.log(html.substring(start, end + 8));
