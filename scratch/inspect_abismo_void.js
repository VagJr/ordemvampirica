const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const fnIdx = html.indexOf('function abismoVoid');
if (fnIdx !== -1) {
    console.log(html.substring(fnIdx, fnIdx + 1500));
}
