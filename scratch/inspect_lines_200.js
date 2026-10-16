const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
console.log('=== LINES 200 - 240 ===');
for (let i = 199; i < 240; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
