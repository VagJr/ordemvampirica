const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = 790527;
const before = html.substring(0, idx);
const lineNum = before.split('\n').length;
console.log('Line number for index 790527:', lineNum);
console.log(html.substring(idx - 100, idx + 400));
