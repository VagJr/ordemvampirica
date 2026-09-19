const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Proximity Chat Input under the 2D canvas controls
const hotbarTarget = `<div class="m2d-hotbar" id="m2d-hotbar-acoes">`;
const chatInputHTML = `
                <!-- CHAT DE PROXIMIDADE 2D -->
                <div style="display:flex; gap:8px; margin-top:8px; margin-bottom:8px; background:#080204; padding:6px; border:1px solid #331518; border-radius:6px;">
                    <input type="text" id="m2d-chat-input" placeholder="[T] Dizer algo na proximidade do mundo 2D (balão flutuante)..." style="flex:1; background:#120306; color:#fff; border:1px solid #4a1520; padding:6px 10px; border-radius:4px; font-size:0.8rem;" onkeydown="if(event.key==='Enter'){ enviarFalaProximidade2D(this.value); this.value=''; }">
                    <button class="btn-magick" onclick="const inp=document.getElementById('m2d-chat-input'); if(inp){ enviarFalaProximidade2D(inp.value); inp.value=''; }" style="padding:6px 14px; font-size:0.75rem; border-color:#ff79c6; color:#ff79c6; white-space:nowrap;">💬 Falar [Enter]</button>
                </div>
                <div class="m2d-hotbar" id="m2d-hotbar-acoes">`;

if (!html.includes('id="m2d-chat-input"')) {
    html = html.replace(hotbarTarget, chatInputHTML);
}

// 2. Add [T] shortcut in aoPressionarTeclaMundo2D
if (!html.includes("k === 't'")) {
    html = html.replace(
        "else if (k === 'b') {",
        "else if (k === 't') {\n            e.preventDefault();\n            document.getElementById('m2d-chat-input')?.focus();\n        } else if (k === 'b') {"
    );
}

// 3. Add World Boss check in executarAcaoPrincipalEspaco
const bossEspacoCheck = `    function executarAcaoPrincipalEspaco() {
        // Verifica se está próximo do Chefe Mundial Azazel (62, 62)
        if (m2dEstado && m2dEstado.worldBoss && m2dEstado.worldBoss.ativo && meuVampiro && m2dEstado.jogadores && m2dEstado.jogadores[meuVampiro.id]) {
            const j = m2dEstado.jogadores[meuVampiro.id];
            const dist = Math.hypot(j.x - m2dEstado.worldBoss.x, j.y - m2dEstado.worldBoss.y);
            if (dist <= 4.5) {
                atacarBossMundial2D();
                return;
            }
        }`;

if (!html.includes('m2dEstado.worldBoss.ativo')) {
    html = html.replace('function executarAcaoPrincipalEspaco() {', bossEspacoCheck);
}

// 4. Render World Boss Azazel in desenharQuadroMundo2D
const worldBossDrawCode = `
        // 5.5 DESENHAR CHEFE MUNDIAL AZAZEL NOS ERMOS DE GEHENNA (62, 62)
        const wb = m2dEstado.worldBoss;
        if (wb && wb.ativo) {
            const screenX = centroX + (wb.x - camX) * tileSize;
            const screenY = centroY + (wb.y - camY) * tileSize;
            if (wb.x >= minTileX - 2 && wb.x <= maxTileX + 2 && wb.y >= minTileY - 2 && wb.y <= maxTileY + 2) {
                const pulse = Math.sin(Date.now() * 0.005) * 8;
                ctx.beginPath();
                ctx.arc(screenX + tileSize / 2, screenY + tileSize / 2, tileSize * 1.6 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 23, 68, 0.28)';
                ctx.fill();

                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('👹', screenX + tileSize / 2, screenY + tileSize / 2 + 12);

                const hpPct = Math.max(0, wb.hp / wb.hpMax);
                ctx.fillStyle = '#1c0205';
                ctx.fillRect(screenX - tileSize, screenY - 20, tileSize * 3, 8);
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(screenX - tileSize, screenY - 20, (tileSize * 3) * hpPct, 8);
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX - tileSize, screenY - 20, tileSize * 3, 8);

                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 9px Cinzel, serif';
                ctx.fillText(\`[CHEFE MUNDIAL] AZAZEL (\${wb.hp}/\${wb.hpMax})\`, screenX + tileSize / 2, screenY - 24);
            }
        }
`;

if (!html.includes('5.5 DESENHAR CHEFE MUNDIAL AZAZEL')) {
    html = html.replace('// 6. DESENHAR MORTAIS / VÍTIMAS VAGANDO', worldBossDrawCode + '\n        // 6. DESENHAR MORTAIS / VÍTIMAS VAGANDO');
}

// 5. Draw Speech Bubbles and Squad Auras in desenharQuadroMundo2D
const speechBubbleDrawCode = `
        // 12. DESENHAR BALÕES DE FALA DE PROXIMIDADE 2D
        const agoraFala = Date.now();
        baloesFala2D = baloesFala2D.filter(b => b.expiraEm > agoraFala);
        baloesFala2D.forEach(b => {
            const screenX = centroX + (b.x - camX) * tileSize;
            const screenY = centroY + (b.y - camY) * tileSize;
            if (screenX >= -120 && screenX <= w + 120 && screenY >= -120 && screenY <= h + 120) {
                const txt = \`\${b.nome}: \${b.texto}\`;
                ctx.font = '11px sans-serif';
                const txtW = ctx.measureText(txt).width;
                const bubbleW = Math.max(80, txtW + 18);
                const bubbleH = 24;
                const bx = screenX + tileSize / 2 - bubbleW / 2;
                const by = screenY - 34;

                ctx.fillStyle = 'rgba(12, 3, 6, 0.92)';
                ctx.strokeStyle = '#ff79c6';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.roundRect(bx, by, bubbleW, bubbleH, 6);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(txt, screenX + tileSize / 2, by + 16);
            }
        });
`;

if (!html.includes('12. DESENHAR BALÕES DE FALA DE PROXIMIDADE 2D')) {
    html = html.replace('// 11. DESENHAR HUD DE INTERAÇÃO PRÓXIMA', speechBubbleDrawCode + '\n        // 11. DESENHAR HUD DE INTERAÇÃO PRÓXIMA');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('2D Canvas social features patched into index.html successfully.');
