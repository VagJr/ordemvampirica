const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for (let i = 1655; i < 1850; i++) {
  if (lines[i].includes('class="aba') || lines[i].includes('</div><!-- fim aba')) {
    console.log(i + 1, lines[i].slice(0, 80));
  }
}
