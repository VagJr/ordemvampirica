const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const dockCatIdx = content.indexOf('class="dock-category"');
if (dockCatIdx !== -1) {
    console.log(content.substring(dockCatIdx - 300, dockCatIdx + 1500));
} else {
    console.log('class="dock-category" not found');
}
