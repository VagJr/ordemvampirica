const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:abrirMobileDrawer|fecharMobileDrawer|mobile-drawer|btn-mobile-drawer)/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0], 'at', m.index);
    console.log(html.substring(Math.max(0, m.index - 50), Math.min(html.length, m.index + 100)));
}
