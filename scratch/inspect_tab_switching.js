const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find function that shows/hides aba-*
const funcMatch = content.match(/function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{[^}]*aba-[^}]*\}/gi);
if (funcMatch) {
    console.log('Tab functions found:\n', funcMatch.slice(0, 5).join('\n---\n'));
} else {
    // Search for any function touching classList or display of abas
    const generalMatches = [...content.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{[\s\S]{1,300}?aba-[\s\S]{1,300}?\}/gi)];
    console.log('General matches:', generalMatches.map(m => m[0].substring(0, 200)));
}

// Check the dock category buttons
const dockSection = content.substring(content.indexOf('class="dock-category"'), content.indexOf('class="dock-category"') + 3000);
console.log('\nDock buttons snippet:\n', dockSection.substring(0, 1500));
