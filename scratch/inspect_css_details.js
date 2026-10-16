const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Inspect all CSS rules for world-ticker
const tickerCss = html.match(/\.world-ticker[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== TICKER CSS ===');
console.log(tickerCss ? tickerCss.join('\n---\n') : 'None');

// 2. Inspect all CSS rules for desktop-hud
const hudCss = html.match(/#desktop-hud[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== HUD CSS ===');
console.log(hudCss ? hudCss.join('\n---\n') : 'None');

// 3. Inspect quick-realm-strip CSS
const stripCss = html.match(/\.quick-realm-strip[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== STRIP CSS ===');
console.log(stripCss ? stripCss.join('\n---\n') : 'None');

// 4. Inspect arena CSS rules
const arenaCss = html.match(/(#arena-acao|\.arena-hud|\.inimigo-container|\.inimigo-sprite|\.inimigo-intent|\.arena-botoes|\.btn-heal-combat|\.btn-flee)[\s\S]*?(?=\n\s*(\.[a-zA-Z]|#[a-zA-Z]|@media|<\/style>))/g);
console.log('=== ARENA CSS ===');
console.log(arenaCss ? arenaCss.join('\n---\n') : 'None');
