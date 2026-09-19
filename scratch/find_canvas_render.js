const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('renderizarMundo2DCanvas') || l.includes('desenharCanvas2D') || l.includes('ctx2D.')) {
    if (l.includes('function ') || l.includes('ctx2D')) {
      console.log(i + 1, l.trim().slice(0, 100));
    }
  }
});
