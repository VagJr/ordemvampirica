const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /#desktop-nav-dock[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0]);
    console.log('---');
}

// Also check lines 430-455
const lines = html.split('\n');
for (let i = 425; i < 455; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
