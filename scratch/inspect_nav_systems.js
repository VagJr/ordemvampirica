const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== CHECKING MOBILE NAV & DRAWER IN HTML ===');

// Check mobile-bottom-nav
const botNavIdx = html.indexOf('id="mobile-bottom-nav"');
if (botNavIdx !== -1) {
    console.log('mobile-bottom-nav snippet:');
    console.log(html.substring(botNavIdx, botNavIdx + 800));
} else {
    console.log('mobile-bottom-nav NOT found in HTML');
}

// Check mobile-drawer
const drawerIdx = html.indexOf('id="mobile-drawer"');
if (drawerIdx !== -1) {
    console.log('\nmobile-drawer snippet:');
    console.log(html.substring(drawerIdx, drawerIdx + 1200));
} else {
    console.log('\nmobile-drawer NOT found in HTML');
}

// Check desktop-nav-dock
const dockIdx = html.indexOf('id="desktop-nav-dock"');
if (dockIdx !== -1) {
    console.log('\ndesktop-nav-dock snippet:');
    console.log(html.substring(dockIdx, dockIdx + 1500));
}
