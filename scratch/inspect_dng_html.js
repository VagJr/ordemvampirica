const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const dngIdx = html.indexOf('id="dungeon-container"');
if (dngIdx !== -1) {
    console.log(html.substring(dngIdx - 200, dngIdx + 800));
}
