const fs = require('fs');

// 1. Update ShadowCore.js
let shadowCode = fs.readFileSync('ShadowCore.js', 'utf8');
shadowCode = shadowCode.replace(/model:\s*['"]llama-3\.3-70b-versatile['"]/g, 'model: this.modelo');
shadowCode = shadowCode.replace(/model:\s*['"]llama-3\.1-8b-instant['"]/g, function(match, offset) {
    const snippet = shadowCode.substring(Math.max(0, offset - 200), offset);
    if (snippet.includes('this.oraculo.groq')) {
        return 'model: this.oraculo.modelo';
    }
    return 'model: this.modelo';
});
shadowCode = shadowCode.replace(/JSON\.parse\(resposta\.choices\[0\]\.message\.content\)/g, 'this._extrairJson(resposta.choices[0].message.content)');
fs.writeFileSync('ShadowCore.js', shadowCode, 'utf8');

// 2. Update server.js
let serverCode = fs.readFileSync('server.js', 'utf8');
serverCode = serverCode.replace(/model:\s*['"]llama-3\.1-8b-instant['"]/g, 'model: this.core.oraculo.modelo || "openai/gpt-oss-120b"');
fs.writeFileSync('server.js', serverCode, 'utf8');

console.log('✅ Models updated in ShadowCore.js and server.js!');
