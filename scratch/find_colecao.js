const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find grimorio or habilidades collection
const idx = html.indexOf('colecaoHabilidades');
if (idx !== -1) {
    console.log(html.substring(idx - 50, idx + 800));
}
