const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:\.dock-category|\.dock-btn|\.dock-cat-header)\s*\{[\s\S]*?\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0]);
    console.log('---');
}
