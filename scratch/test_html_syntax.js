const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

// Extrai todos os blocos <script> que não são CDNs externos
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let totalBytes = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1].trim();
    if (!code) continue;
    count++;
    totalBytes += code.length;
    try {
        new vm.Script(code);
    } catch (e) {
        console.error(`❌ Erro de sintaxe no bloco <script> #${count}:`, e.message);
        process.exit(1);
    }
}

console.log(`✅ Sintaxe válida! ${count} blocos de script testados (${(totalBytes / 1024).toFixed(1)} KB) sem nenhum erro de sintaxe.`);
