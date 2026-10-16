const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.world-ticker {')) {
        console.log(`Line ${i+1}: ${lines[i]}`);
        for (let j = i; j < Math.min(lines.length, i + 20); j++) {
            console.log(`${j+1}: ${lines[j]}`);
        }
    }
}
