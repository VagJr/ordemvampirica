const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function realizarLogin');
if (idx !== -1) {
    console.log(html.substring(idx, idx + 600));
} else {
    const idx2 = html.indexOf('login');
    console.log('first login at:', idx2);
}
