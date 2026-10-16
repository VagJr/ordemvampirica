const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const dockStart = html.indexOf('id="desktop-nav-dock"');
const dockEnd = html.indexOf('</aside>', dockStart);
console.log(html.substring(dockStart, dockEnd + 8));
