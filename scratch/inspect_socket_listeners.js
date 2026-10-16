const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes("socket.on('tick") || l.includes("socket.on('sync") || l.includes("socket.on('dungeon") || l.includes("socket.on('combate")) {
        console.log(`L${i+1}: ${l.trim().substring(0, 140)}`);
    }
});
