const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = '<button class="dock-btn" data-aba="panteao" onclick="nav(\'panteao\', this)"><span>⚡</span> Panteão Divino</button>';
const replacement = `<button class="dock-btn" data-aba="panteao" onclick="nav('panteao', this)"><span>⚡</span> Panteão Divino</button>
                <button class="dock-btn" data-aba="social" onclick="nav('social', this)"><span style="color:#ff79c6;">🐺</span> Social & Co-op</button>
                <button class="dock-btn" data-aba="mundo2d" onclick="nav('mundo2d', this)"><span style="color:#0f5;">🌌</span> Mundo 2D Sandbox</button>`;

if (html.includes(targetStr)) {
    // Only replace the first occurrence (which is inside desktop-nav-dock)
    const idx = html.indexOf(targetStr);
    html = html.substring(0, idx) + replacement + html.substring(idx + targetStr.length);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('✅ Added Social & Co-op and Mundo 2D to PC desktop-nav-dock');
} else {
    console.error('⚠️ Target panteao button not found');
}
