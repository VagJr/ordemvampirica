const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /scrollbar[^{]*\{[\s\S]*?\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0]);
    console.log('---');
}

// check desktop-nav-dock scroll styling
const dockScroll = html.match(/#desktop-nav-dock[^{]*scrollbar/g);
console.log('dockScroll:', dockScroll);
