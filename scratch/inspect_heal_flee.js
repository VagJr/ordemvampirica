const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:btn-heal-combat|btn-flee)/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0], 'at', m.index);
    console.log(html.substring(m.index - 50, m.index + 100));
}
