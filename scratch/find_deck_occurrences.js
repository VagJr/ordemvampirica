const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let pos = 0;
while ((pos = html.indexOf('arena-controls-deck', pos)) !== null && pos !== -1) {
    const before = html.substring(0, pos);
    const lineNum = before.split('\n').length;
    console.log('Found at pos:', pos, 'line:', lineNum);
    pos += 19;
}
