const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const m = html.match(/id="[^"]*login[^"]*"/gi);
console.log('Login IDs:', m);
const m2 = html.match(/onclick="[^"]*login[^"]*"/gi);
console.log('Login onclicks:', m2);
