const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const bibIdx = content.indexOf('id="aba-biblioteca"');
const bibEnd = content.indexOf('</section>', bibIdx) !== -1 ? content.indexOf('</section>', bibIdx) : content.indexOf('</div>\n\n        <div id="aba-', bibIdx);
console.log('Bib end snippet:\n', content.substring(bibEnd - 200, bibEnd + 200));
