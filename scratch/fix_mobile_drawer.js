const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('id="mobile-drawer"');
console.log(html.substring(startIdx, startIdx + 3800));
