const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(`Keyframe: ${m[1]} -> ${m[2].trim().substring(0, 100)}`);
}
