const fs = require('fs');
const html = fs.readFileSync('c:/ordemvampirica/index.html', 'utf8');

function findElementRange(targetId) {
    const idStr = `id="${targetId}"`;
    const idx = html.indexOf(idStr);
    if (idx === -1) return null;
    
    // Find the opening tag start '<'
    const tagStart = html.lastIndexOf('<', idx);
    const tagMatch = html.substring(tagStart).match(/^<([a-zA-Z0-9\-]+)/);
    const tagName = tagMatch[1];
    
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    if (voidTags.has(tagName.toLowerCase())) {
        const tagEnd = html.indexOf('>', tagStart) + 1;
        return { id: targetId, tag: tagName, start: tagStart, end: tagEnd, startLine: html.substring(0, tagStart).split('\n').length, endLine: html.substring(0, tagEnd).split('\n').length };
    }
    
    // Track depth
    const regex = new RegExp(`</?${tagName}(\\s+[^>]*)?/?>`, 'gi');
    regex.lastIndex = tagStart;
    let depth = 0;
    let m;
    let endIdx = -1;
    
    while ((m = regex.exec(html)) !== null) {
        if (!m[0].startsWith('</')) {
            depth++;
        } else {
            depth--;
            if (depth === 0) {
                endIdx = m.index + m[0].length;
                break;
            }
        }
    }
    
    const startLine = html.substring(0, tagStart).split('\n').length;
    const endLine = html.substring(0, endIdx).split('\n').length;
    return { id: targetId, tag: tagName, start: tagStart, end: endIdx, startLine, endLine };
}

const keyIds = [
    'splash-inicial',
    'intro-video-container',
    'stage-login',
    'ui-login',
    'ui-main',
    'desktop-hud',
    'quick-realm-strip',
    'desktop-side-panel',
    'desktop-stage',
    'desktop-nav-dock',
    'mobile-bottom-nav',
    'aba-mapa',
    'aba-compendio',
    'aba-aventura',
    'aba-astrolabio',
    'aba-oficios',
    'aba-perfil',
    'aba-caca',
    'aba-pvp',
    'aba-leilao',
    'aba-chat',
    'aba-magia',
    'aba-biblioteca',
    'aba-umbral',
    'aba-conclave',
    'aba-clan',
    'aba-reinos',
    'aba-banco',
    'aba-panteao',
    'aba-familiars',
    'aba-labirinto'
];

console.log('=== LIMITES DOS ELEMENTOS PRINCIPAIS ===');
keyIds.forEach(id => {
    const range = findElementRange(id);
    if (!range) {
        console.log(`Element #${id}: NOT FOUND`);
    } else {
        console.log(`Element #${id.padEnd(20)} [${range.tag}] -> Linhas ${String(range.startLine).padStart(4)} até ${String(range.endLine).padStart(4)} (${range.end - range.start} bytes)`);
    }
});
