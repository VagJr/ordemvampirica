const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const botNavIdx = html.indexOf('id="mobile-bottom-nav"');
const botNavEnd = html.indexOf('</nav>', botNavIdx);
console.log('=== MOBILE-BOTTOM-NAV ===');
console.log(html.substring(botNavIdx, botNavEnd + 6));

const drawerIdx = html.indexOf('id="mobile-drawer"');
const drawerEnd = html.indexOf('</aside>', drawerIdx);
console.log('=== MOBILE-DRAWER ===');
console.log(html.substring(drawerIdx, drawerEnd !== -1 ? drawerEnd + 8 : drawerIdx + 2000));
