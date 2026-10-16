const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('arena-controls-deck');
console.log('arena-controls-deck at char:', idx);
const before = html.substring(0, idx);
const lineNum = before.split('\n').length;
console.log('arena-controls-deck line number:', lineNum);
