const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:function\s+auth|auth\s*=\s*(?:async\s*)?function|const\s+auth\s*=|let\s+auth\s*=|var\s+auth\s*=)/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0], 'at', m.index);
    console.log(html.substring(m.index, m.index + 500));
}
