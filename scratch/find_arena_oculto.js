const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /#arena-acao['"]\)\.forEach\([^)]*\)|#arena-acao['"]\)\.classList/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(html.substring(Math.max(0, m.index - 50), Math.min(html.length, m.index + 150)));
}
