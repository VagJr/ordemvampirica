const fs = require('fs');

const path = 'c:/ordemvampirica/ShadowCore.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Injetar imports no topo
if (!content.includes("require('./OrdemMagicaCore.js')")) {
    content = content.replace(
        "const MundoAberto2D = require('./MundoAberto2D.js');",
        "const MundoAberto2D = require('./MundoAberto2D.js');\nconst { OrdemMagicaCore, GRAUS_INICIATICOS } = require('./OrdemMagicaCore.js');\nconst { CombatEngine, ARQUETIPOS_IA } = require('./CombatEngine.js');"
    );
}

// 2. Instanciar no construtor de ShadowCore
if (!content.includes("this.ordensCore = new OrdemMagicaCore(this);")) {
    content = content.replace(
        "this.mundo2D = new MundoAberto2D(this);",
        "this.mundo2D = new MundoAberto2D(this);\n        this.ordensCore = new OrdemMagicaCore(this);\n        this.combatEngine = new CombatEngine(this);"
    );
}

// 3. Persistência no salvarBancoDeDados e conectarDatabase
if (!content.includes("ordensData: this.ordensCore")) {
    content = content.replace(
        "reinos: this.reinos,",
        "reinos: this.reinos,\n            ordensData: this.ordensCore ? this.ordensCore.salvarEstado() : null,"
    );
}

if (!content.includes("this.ordensCore.carregarEstado(doc.ordensData)")) {
    content = content.replace(
        "this.reinos = doc.reinos || {};",
        "this.reinos = doc.reinos || {};\n                if (doc.ordensData && this.ordensCore) { this.ordensCore.carregarEstado(doc.ordensData); }"
    );
}

fs.writeFileSync(path, content, 'utf8');
console.log('ShadowCore.js imports and persistence successfully updated.');
