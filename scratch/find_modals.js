const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('modal') || l.includes('abrirModalAnunciarMercado')) {
    if (l.includes('id=') || l.includes('function ')) {
      console.log(i + 1, l.trim().slice(0, 100));
    }
  }
});
