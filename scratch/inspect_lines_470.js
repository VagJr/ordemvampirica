const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
for (let i = 470; i < 520; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
