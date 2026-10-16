const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
console.log('=== LINES 455 - 530 ===');
for (let i = 454; i < 530; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
