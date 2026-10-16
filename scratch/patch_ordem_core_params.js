const fs = require('fs');

const path = 'c:/ordemvampirica/OrdemMagicaCore.js';
let content = fs.readFileSync(path, 'utf8');

// Adiciona _resolverVampiro no início de OrdemMagicaCore se não existir
const helperMethod = `    _resolverVampiro(entidade) {
        if (!entidade) return null;
        if (typeof entidade === 'string') return this.shadowCore?.vampiros?.[entidade] || null;
        return entidade;
    }
`;

if (!content.includes('_resolverVampiro(')) {
    content = content.replace('constructor(shadowCore) {', helperMethod + '\n    constructor(shadowCore) {');
}

// Substitui criarOrdem para aceitar tanto id quanto objeto
content = content.replace(
    /criarOrdem\(fundador,\s*dados\)\s*\{/,
    `criarOrdem(fundadorParam, dados = {}) {
        const fundador = this._resolverVampiro(fundadorParam);`
);

// Substitui iniciarNeofito
content = content.replace(
    /iniciarNeofito\(mestre,\s*alvoId\)\s*\{/,
    `iniciarNeofito(mestreParam, ordemIdOuAlvo, juramentoSangue) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        // Suporta tanto (mestre, alvoId) quanto (id, ordemId, juramento) ou (mestre, ordemId, alvoId)
        let alvoId = (typeof juramentoSangue === 'string' && ordemIdOuAlvo.startsWith('ordem_')) ? mestre.id : (typeof ordemIdOuAlvo === 'string' && !ordemIdOuAlvo.startsWith('ordem_') ? ordemIdOuAlvo : juramentoSangue || ordemIdOuAlvo);
        if (typeof ordemIdOuAlvo === 'string' && ordemIdOuAlvo.startsWith('ordem_') && mestreParam !== ordemIdOuAlvo) {
            // Chamada de /api/ordem/iniciar_neofito com { id, ordemId, juramentoSangue }
            alvoId = mestre.id; // o requisitante é quem quer entrar na ordem
            const ordemAlvo = this.ordens[ordemIdOuAlvo];
            if (!ordemAlvo) return { erro: "Ordem não encontrada." };
            if (mestre.ordemId && this.ordens[mestre.ordemId]) return { erro: "Já pertences a uma Ordem." };
            ordemAlvo.membros[mestre.id] = { nome: mestre.nome, grau: 0, dataIngresso: Date.now(), contribuicaoGts: 0 };
            mestre.ordemId = ordemAlvo.id;
            mestre.grauOrdem = 0;
            this.shadowCore._registrarEventoEspecial('global', 'JURAMENTO INICIÁTICO', \`[\${mestre.nome}] prestou o Juramento de Sangue e ingressou como Neófito 0° na [\${ordemAlvo.nome}]!\`, true);
            this.shadowCore._salvarBancoDeDados();
            return { sucesso: true, relato: \`[\${mestre.nome}] foi consagrado Neófito 0° na Ordem [\${ordemAlvo.nome}]!\` };
        }`
);

// Substitui promoverGrau
content = content.replace(
    /promoverGrau\(mestre,\s*alvoId\)\s*\{/,
    `promoverGrau(mestreParam, ordemIdOuAlvo, membroIdParam) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        const alvoId = membroIdParam || ordemIdOuAlvo;`
);

// Substitui doarEgregora
content = content.replace(
    /doarEgregora\(vampiro,\s*doacoes\s*=\s*\{\}\)\s*\{/,
    `doarEgregora(vampiroParam, ordemIdOuDoacoes, quantiaVitae) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Iniciado não encontrado." };
        let doacoes = {};
        if (typeof ordemIdOuDoacoes === 'object') {
            doacoes = ordemIdOuDoacoes;
        } else if (quantiaVitae !== undefined) {
            doacoes = { gts: parseInt(quantiaVitae) || 0 };
        } else if (typeof ordemIdOuDoacoes === 'number' || !isNaN(Number(ordemIdOuDoacoes))) {
            doacoes = { gts: parseInt(ordemIdOuDoacoes) || 0 };
        }`
);

// Substitui proclamarDecreto
content = content.replace(
    /proclamarDecreto\(mestre,\s*titulo,\s*efeitoDesc\)\s*\{/,
    `proclamarDecreto(mestreParam, tituloOuOrdem, tituloDecretoOuTexto, textoDecreto) {
        const mestre = this._resolverVampiro(mestreParam);
        if (!mestre) return { erro: "Mestre não encontrado." };
        let titulo = tituloOuOrdem;
        let efeitoDesc = tituloDecretoOuTexto;
        if (textoDecreto !== undefined) {
            titulo = tituloDecretoOuTexto;
            efeitoDesc = textoDecreto;
        }`
);

// Substitui submeterTese
content = content.replace(
    /async submeterTese\(vampiro,\s*dados\)\s*\{/,
    `async submeterTese(vampiroParam, dadosOuTitulo, esferaParam, corpoTextoParam) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Autor não encontrado." };
        let dados = dadosOuTitulo;
        if (typeof dadosOuTitulo === 'string') {
            dados = { titulo: dadosOuTitulo, tema: esferaParam || "Hermetismo", conteudo: corpoTextoParam || "" };
        }`
);

// Substitui estudarTomo
content = content.replace(
    /estudarTomo\(vampiro,\s*tomoId\)\s*\{/,
    `estudarTomo(vampiroParam, tomoId) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Estudante não encontrado." };`
);

// Substitui forjarFeiticoEmCodigo
content = content.replace(
    /forjarFeiticoEmCodigo\(vampiro,\s*dados\)\s*\{/,
    `forjarFeiticoEmCodigo(vampiroParam, dados = {}) {
        const vampiro = this._resolverVampiro(vampiroParam);
        if (!vampiro) return { erro: "Criador não encontrado." };`
);

// Substitui conjurarFeiticoEmCodigo
content = content.replace(
    /async conjurarFeiticoEmCodigo\(invocador,\s*feiticoId,\s*contexto\s*=\s*\{\}\)\s*\{/,
    `async conjurarFeiticoEmCodigo(invocadorParam, feiticoId, contexto = {}) {
        const invocador = this._resolverVampiro(invocadorParam);
        if (!invocador) return { erro: "Invocador não encontrado." };`
);

fs.writeFileSync(path, content, 'utf8');
console.log('OrdemMagicaCore.js parameters successfully normalized.');
