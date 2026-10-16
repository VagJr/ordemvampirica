const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
console.log('=== LINES 655 - 715 ===');
for (let i = 654; i < 715; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
