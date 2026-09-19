const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('m2d-canvas') || l.includes('getContext(\'2d\'') || l.includes('getContext("2d"')) {
    console.log(i + 1, l.trim().slice(0, 100));
  }
});
