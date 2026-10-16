const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
console.log('=== LINES 2195 - 2270 ===');
for (let i = 2194; i < 2270; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
