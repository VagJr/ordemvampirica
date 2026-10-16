const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:arena-boss-postura|arena-alerta-visceral|btn-arena-visceral)/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0], 'at', m.index);
    console.log(html.substring(m.index - 50, m.index + 200));
}
