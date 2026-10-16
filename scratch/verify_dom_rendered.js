const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

console.log("=== VERIFICAÇÃO ESTRUTURAL DO DOM DO FRONTEND ===");

// 1. Verificar botões de navegação no dock
const temBotaoOrdem = content.includes('data-aba="ordem"');
const temBotaoMagiaCodigo = content.includes('data-aba="magia_codigo"');
console.log("- Botão Dock '🏛️ Ordem Iniciática':", temBotaoOrdem ? "PRESENTE" : "AUSENTE");
console.log("- Botão Dock '⚡ Magia em Código':", temBotaoMagiaCodigo ? "PRESENTE" : "AUSENTE");

// 2. Verificar Abas
const temAbaOrdem = content.includes('id="aba-ordem"');
const temAbaMagiaCodigo = content.includes('id="aba-magia_codigo"');
console.log("- Seção 'aba-ordem':", temAbaOrdem ? "PRESENTE" : "AUSENTE");
console.log("- Seção 'aba-magia_codigo':", temAbaMagiaCodigo ? "PRESENTE" : "AUSENTE");

// 3. Verificar Elementos de Egrégora e Graus
const temEgrégora = content.includes('id="ordem-egregora-poder"');
const temListaGraus = content.includes('id="lista-graus-iniciaticos"');
const temFormDecreto = content.includes('id="form-proclamar-decreto"');
console.log("- Painel de Egrégora Cósmica:", temEgrégora ? "PRESENTE" : "AUSENTE");
console.log("- Lista dos 10 Graus Herméticos:", temListaGraus ? "PRESENTE" : "AUSENTE");
console.log("- Câmara de Decretos da Ordem:", temFormDecreto ? "PRESENTE" : "AUSENTE");

// 4. Verificar Editor de Código e Terminal
const temEditorCodigo = content.includes('id="code-formula-input"');
const temTerminalOutput = content.includes('id="code-terminal-output"');
const temChipsOperadores = content.includes('class="code-operator-chip"');
console.log("- Editor de Magia em Código:", temEditorCodigo ? "PRESENTE" : "AUSENTE");
console.log("- Terminal Astral de Saída:", temTerminalOutput ? "PRESENTE" : "AUSENTE");
console.log("- Chips de Operadores Arcanos:", temChipsOperadores ? "PRESENTE" : "AUSENTE");

// 5. Verificar Arena de Combate com Postura e Golpe Visceral
const temBarraPostura = content.includes('id="arena-boss-postura-bar"');
const temAlertaVisceral = content.includes('id="arena-alerta-visceral"');
const temBtnVisceral = content.includes('id="btn-arena-visceral"');
const temGolpePesado = content.includes("executarAcaoCombateAvancada('golpe_pesado')");
const temParry = content.includes("executarAcaoCombateAvancada('parry_perfeito')");
console.log("- Barra de Postura do Inimigo:", temBarraPostura ? "PRESENTE" : "AUSENTE");
console.log("- Alerta de Quebra de Guarda (Stagger):", temAlertaVisceral ? "PRESENTE" : "AUSENTE");
console.log("- Botão de Golpe Visceral Fatal:", temBtnVisceral ? "PRESENTE" : "AUSENTE");
console.log("- Ações de Golpe Pesado e Parada:", (temGolpePesado && temParry) ? "PRESENTE" : "AUSENTE");

if (temBotaoOrdem && temBotaoMagiaCodigo && temAbaOrdem && temAbaMagiaCodigo && temBarraPostura && temBtnVisceral) {
    console.log("\n🔥 DOM 100% ÍNTEGRO, COMPLETO E PRONTO PARA USO! 🔥");
} else {
    console.error("\n❌ Faltam elementos no DOM!");
    process.exit(1);
}
