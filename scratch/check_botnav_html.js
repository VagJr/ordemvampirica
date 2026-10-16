const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const navIdx = html.indexOf('id="mobile-bottom-nav"');
const navEnd = html.indexOf('</nav>', navIdx);
console.log('=== MOBILE BOTTOM NAV IN HTML ===');
console.log(html.substring(navIdx, navEnd + 6));
