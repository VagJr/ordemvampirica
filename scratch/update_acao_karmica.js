const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const targetSnippet = `app.post('/api/nosferatu/acao_karmica', async (req, res) => {
    try {
        const { adminId, alvoId, acao } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin || (!admin.admin && admin.geracao !== 1 && admin.nivel < 99)) {
            return res.status(403).json({ erro: "Heresia. Acesso negado ao Véu." });
        }

        const acoes = {
            'drenar_vitalidade': { nome: 'Drenagem de Vitalidade', custo: 500, desc: 'A energia vital do alvo foi drenada pelas sombras. As forças do Véu respondem com um arrepio dimensional.' },
            'sussurro_veu': { nome: 'Sussurro no Véu', custo: 200, desc: 'Um sussurro astral foi enviado através do Véu. O alvo sentirá um arrepio inexplicável, como se estivesse a ser observado.' },
            'maldicao_espelho': { nome: 'Maldição do Espelho', custo: 1000, desc: 'O espelho negro reflecte a verdade oculta do alvo. Cada reflexo que vir conterá uma sombra a mais.' },
            'laco_sangue': { nome: 'Laço de Sangue', custo: 800, desc: 'Um laço kármico de sangue foi estabelecido. O destino do alvo está agora entrelaçado com o do invocador.' },
            'olho_seth': { nome: 'Olho de Seth', custo: 600, desc: 'O Olho de Seth foi aberto sobre o alvo. Cada acção será registada nos anais do Véu Nosferatu.' },
            'sombra_akasha': { nome: 'Sombra de Akasha', custo: 1500, desc: 'A Sombra de Akasha desceu sobre o alvo. O peso de todas as vidas passadas agora pesa sobre a sua consciência.' }
        };

        const acaoData = acoes[acao];
        if (!acaoData) return res.status(400).json({ erro: "Acção kármica desconhecida." });
        if (admin.sangue < acaoData.custo) return res.status(400).json({ erro: \`Sangue insuficiente. Necessário: \${acaoData.custo} Gts.\` });

        admin.sangue -= acaoData.custo;

        // Registar nos logs
        core._registrarEventoEspecial(admin.id, 'KARMA NOSFERATU', \`\${admin.nome} executou [\${acaoData.nome}] sobre o alvo [\${alvoId}].\`, false);
        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);

        res.json({ sucesso: true, relato: \`🕸️ \${acaoData.nome.toUpperCase()}: \${acaoData.desc}\` });
    } catch(e) {
        console.error('Nosferatu Ação Kármica Error:', e);
        res.status(500).json({ erro: "O Véu rejeitou a acção kármica." });
    }
});`;

const newSnippet = `app.post('/api/nosferatu/acao_karmica', async (req, res) => {
    try {
        const { adminId, alvoId, acao, intencaoPersonalizada } = req.body;
        const admin = core.vampiros[adminId];
        if (!admin || (!admin.admin && admin.geracao !== 1 && admin.nivel < 99)) {
            return res.status(403).json({ erro: "Heresia. Acesso negado ao Véu." });
        }

        if (!admin.alvosNosferatu || admin.alvosNosferatu.length === 0) {
            return res.status(404).json({ erro: "Nenhum alvo registrado no teu Véu." });
        }

        const alvo = admin.alvosNosferatu.find(a => a.alvoId === alvoId || a.nomeAstral.toLowerCase() === (alvoId || '').toLowerCase());
        if (!alvo) {
            return res.status(404).json({ erro: "Alvo não localizado no teu Livro das Sombras." });
        }

        const acoes = {
            // 💖 ESFERA 1: AÇÕES CARINHOSAS & BÊNÇÃOS ASTRAIS
            'toque_seda': {
                nome: 'Toque de Seda Astral',
                categoria: 'carinhosa',
                custo: 300,
                desc: 'Uma brisa suave de vitae percorre o campo áurico do alvo, dissipando angústias mundanas e conferindo serenidade profunda ao sono.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.min(100, (alvo.resistenciaPsiquica || 50) + 15);
                    alvo.vulnerabilidadeEspiritual = Math.max(10, (alvo.vulnerabilidadeEspiritual || 50) - 10);
                    if (alvo.estadoAstral === 'Atormentado pelas Sombras') alvo.estadoAstral = 'Vigília Mundana';
                }
            },
            'bencao_lilith': {
                nome: 'Manto Protetor de Lilith',
                categoria: 'carinhosa',
                custo: 600,
                desc: 'As asas aveludadas de Lilith envolvem o duplo astral do mortal em uma cúpula impenetrável contra inveja, mau-olhado e feitiços hostis de terceiros.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Abençoado por Lilith';
                    if (!alvo.bencaosAtivas) alvo.bencaosAtivas = [];
                    if (!alvo.bencaosAtivas.includes('Manto de Lilith')) alvo.bencaosAtivas.push('Manto de Lilith');
                    alvo.resistenciaPsiquica = Math.min(100, (alvo.resistenciaPsiquica || 50) + 25);
                }
            },
            'flor_sangue': {
                nome: 'Flor de Sangue (Magnetismo Afetivo)',
                categoria: 'carinhosa',
                custo: 500,
                desc: 'Uma pétala de fogo etéreo ancora no centro cardíaco do mortal, despertando calor ardente, empatia e súbita afeição irresistível pelo Mestre.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Enfeitiçado pelo Sangue';
                    alvo.polaridadeAlma = 'Luz Radiante';
                }
            },
            'musa_noturna': {
                nome: 'Musa das Trevas (Iluminação Criativa)',
                categoria: 'carinhosa',
                custo: 400,
                desc: 'Lampejos do Akasha profundo penetram o intelecto da pessoa, destravando epifanias artísticas, criatividade visceral e clareza de visão.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 741;
                    alvo.vasoInfluencia = Math.min(100, (alvo.vasoInfluencia || 50) + 10);
                }
            },

            // ⚡ ESFERA 2: INFLUÊNCIAS SUTIS & DOMÍNIO MENTAL
            'sugestao_onirica': {
                nome: 'Sugestão Onírica Direcionada',
                categoria: 'influencia',
                custo: 700,
                desc: 'Um impulso psíquico é sussurrado nos ciclos de sono do mortal. Ele despertará com a certeza inabalável de que a ideia emanou do seu próprio subconsciente.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Sob Sugestão Onírica';
                    alvo.vulnerabilidadeEspiritual = Math.min(100, (alvo.vulnerabilidadeEspiritual || 50) + 15);
                }
            },
            'eco_egregora': {
                nome: 'Eco da Egrégora (Sincronicidades)',
                categoria: 'influencia',
                custo: 500,
                desc: 'O nome e a presença da Ordem vibram na mente do alvo através de números repetidos (333, 666), déjà vu incessante e sincronicidades marcantes.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 396;
                }
            },
            'espelho_ilusorio': {
                nome: 'Espelho Ilusório (Distorção da Percepção)',
                categoria: 'influencia',
                custo: 650,
                desc: 'O espelho de obsidiana refracta a autoimagem do mortal. Ele passará a duvidar de certezas mundanas e sentirá o peso de presenças ocultas no aposento.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.max(15, (alvo.resistenciaPsiquica || 50) - 15);
                }
            },
            'laco_obsessao': {
                nome: 'Laço de Obsessão Astral',
                categoria: 'influencia',
                custo: 900,
                desc: 'Um filamento de prata rubra une a mente do alvo ao trono do Mestre Supremo. Seus pensamentos orbitarão a figura do soberano sem explicação racional.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Laço Kármico Ativo';
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 10);
                }
            },

            // 🩸 ESFERA 3: AÇÕES MALÉFICAS & FLAGELOS OBSCUROS
            'pesadelo_abissal': {
                nome: 'Invasão de Pesadelos (Paralisia do Sono)',
                categoria: 'malefica',
                custo: 800,
                desc: 'Horrores ancestrais rastejam até o leito do alvo: paralisia noturna, sensação de peso sufocante sobre o peito e sombras que fitam dos cantos do quarto.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Atormentado pelas Sombras';
                    alvo.resistenciaPsiquica = Math.max(10, (alvo.resistenciaPsiquica || 50) - 25);
                    alvo.purezaSangue = Math.max(15, (alvo.purezaSangue || 50) - 15);
                }
            },
            'drenagem_voraz': {
                nome: 'Drenagem Voraz de Alma',
                categoria: 'malefica',
                custo: 200,
                desc: 'As garras astrais cravam-se na nuca do alvo através do Véu, sugando sua vitalidade etérea e abastecendo o Cálice de Sangue do Mestre com 1.000 Gts de pura Vitae!',
                aplicar: (alvo, admin) => {
                    admin.sangue = (admin.sangue || 0) + 1000;
                    alvo.purezaSangue = Math.max(10, (alvo.purezaSangue || 50) - 30);
                    alvo.vulnerabilidadeEspiritual = Math.min(95, (alvo.vulnerabilidadeEspiritual || 50) + 20);
                }
            },
            'olho_seth': {
                nome: 'Olho de Seth (Desfortuna & Ruína Prática)',
                categoria: 'malefica',
                custo: 1000,
                desc: 'O Olho de Seth projeta entropia cósmica nos caminhos práticos do alvo: falhas de acordos, aparelhos quebrados, discórdias súbitas e perdas materiais.',
                aplicar: (alvo, admin) => {
                    if (!alvo.maldicoesAtivas) alvo.maldicoesAtivas = [];
                    if (!alvo.maldicoesAtivas.includes('Olho de Seth')) alvo.maldicoesAtivas.push('Olho de Seth');
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 20);
                }
            },
            'acoite_sombra': {
                nome: 'Açoite de Sangue Negro',
                categoria: 'malefica',
                custo: 1200,
                desc: 'Um golpe devastador de energia sombria fragmenta o campo áurico do alvo, provocando exaustão física imediata, enxaquecas e frio nos ossos.',
                aplicar: (alvo, admin) => {
                    alvo.essencia = 'Sangue Negro (Pecador)';
                    alvo.polaridadeAlma = 'Trevas Abissais';
                    alvo.resistenciaPsiquica = Math.max(5, (alvo.resistenciaPsiquica || 50) - 35);
                }
            },

            // 🕳️ ESFERA 4: CONDENAÇÕES SUPREMAS, LIMBO & RESGATE
            'banir_ao_limbo': {
                nome: 'Banimento ao Limbo Astral',
                categoria: 'limbo',
                custo: 2000,
                desc: 'A fenda dimensional se abre com um estrondo silencioso: o duplo astral do alvo é arrastado para o Vazio Cinzento do Limbo. Lá, o tempo não flui, suas defesas desvanecem e sua alma fica completamente à mercê da vontade do Mestre.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Preso no Limbo Astral';
                    alvo.resistenciaPsiquica = 5;
                    alvo.vulnerabilidadeEspiritual = 99;
                    alvo.frequenciaVibracionalHz = 174;
                }
            },
            'condenar_ao_tartaro': {
                nome: 'Condenação ao Tártaro Cósmico',
                categoria: 'limbo',
                custo: 3000,
                desc: 'O decreto irrevogável do Juiz Cósmico: a alma do mortal é acorrentada no poço primordial de enxofre e chamas negras de Tiamat. O sigilo do mortal arde em agonia perpétua.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Condenado ao Tártaro';
                    alvo.polaridadeAlma = 'Caos Primordial';
                    alvo.essencia = 'Alma Fragmentada';
                    alvo.resistenciaPsiquica = 0;
                    alvo.taxaCorrupcao = 99;
                }
            },
            'resgatar_do_limbo': {
                nome: 'Resgate & Absolvição Soberana',
                categoria: 'limbo',
                custo: 500,
                desc: 'Com soberano poder de vida e morte, o Mestre estende a mão para as profundezas do Vazio, quebrando as correntes e trazendo a alma de volta à Vigília Mundana com purificação de seu carma.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Vigília Mundana';
                    alvo.taxaCorrupcao = Math.max(10, (alvo.taxaCorrupcao || 50) - 30);
                    alvo.resistenciaPsiquica = 60;
                    alvo.frequenciaVibracionalHz = 528;
                    alvo.maldicoesAtivas = [];
                }
            },

            // Legado retrocompatível
            'drenar_vitalidade': {
                nome: 'Drenagem de Vitalidade',
                categoria: 'malefica',
                custo: 500,
                desc: 'A energia vital do alvo foi drenada pelas sombras. As forças do Véu respondem com um arrepio dimensional.',
                aplicar: (alvo, admin) => {
                    admin.sangue += 500;
                    alvo.purezaSangue = Math.max(20, (alvo.purezaSangue || 50) - 15);
                }
            },
            'sussurro_veu': {
                nome: 'Sussurro no Véu',
                categoria: 'influencia',
                custo: 200,
                desc: 'Um sussurro astral foi enviado através do Véu. O alvo sentirá um arrepio inexplicável, como se estivesse a ser observado.',
                aplicar: (alvo, admin) => {
                    alvo.frequenciaVibracionalHz = 417;
                }
            },
            'maldicao_espelho': {
                nome: 'Maldição do Espelho',
                categoria: 'malefica',
                custo: 1000,
                desc: 'O espelho negro reflecte a verdade oculta do alvo. Cada reflexo que vir conterá uma sombra a mais.',
                aplicar: (alvo, admin) => {
                    alvo.resistenciaPsiquica = Math.max(10, (alvo.resistenciaPsiquica || 50) - 20);
                }
            },
            'laco_sangue': {
                nome: 'Laço de Sangue',
                categoria: 'carinhosa',
                custo: 800,
                desc: 'Um laço kármico de sangue foi estabelecido. O destino do alvo está agora entrelaçado com o do invocador.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Laço Kármico Ativo';
                }
            },
            'sombra_akasha': {
                nome: 'Sombra de Akasha',
                categoria: 'limbo',
                custo: 1500,
                desc: 'A Sombra de Akasha desceu sobre o alvo. O peso de todas as vidas passadas agora pesa sobre a sua consciência.',
                aplicar: (alvo, admin) => {
                    alvo.estadoAstral = 'Sob a Sombra de Akasha';
                    alvo.taxaCorrupcao = Math.min(100, (alvo.taxaCorrupcao || 50) + 15);
                }
            }
        };

        const acaoData = acoes[acao];
        if (!acaoData) return res.status(400).json({ erro: "Acção kármica desconhecida no cânone de Nosferatu." });
        if (admin.sangue < acaoData.custo) {
            return res.status(400).json({ erro: \`Sangue insuficiente. O rito exige \${acaoData.custo} Gts de Vitae.\` });
        }

        admin.sangue -= acaoData.custo;

        // Aplica as mutações no alvo
        if (typeof acaoData.aplicar === 'function') {
            acaoData.aplicar(alvo, admin, intencaoPersonalizada);
        }

        const relatoIntencao = intencaoPersonalizada ? \`\\n🔮 Intenção Emanada: "\${intencaoPersonalizada.trim()}"\` : '';
        const relatoCompleto = \`🕸️ [\${acaoData.categoria.toUpperCase()}] \${acaoData.nome.toUpperCase()}: \${acaoData.desc}\${relatoIntencao}\`;

        if (!alvo.historicoAcoes) alvo.historicoAcoes = [];
        alvo.historicoAcoes.unshift({
            acao,
            nome: acaoData.nome,
            categoria: acaoData.categoria,
            custo: acaoData.custo,
            data: Date.now(),
            relato: relatoCompleto,
            intencao: intencaoPersonalizada?.trim() || null,
            novoEstadoAstral: alvo.estadoAstral
        });
        if (alvo.historicoAcoes.length > 50) alvo.historicoAcoes.pop();

        core._registrarEventoEspecial(admin.id, 'EMANACAO NOSFERATU', \`\${admin.nome} emanou [\${acaoData.nome}] sobre [\${alvo.nomeAstral}] (\${alvo.estadoAstral}).\`, false);
        core._salvarBancoDeDados();
        forcarSyncJogador(admin.id);

        res.json({
            sucesso: true,
            relato: relatoCompleto,
            acao: acaoData.nome,
            categoria: acaoData.categoria,
            novoEstadoAstral: alvo.estadoAstral,
            alvo
        });
    } catch(e) {
        console.error('Nosferatu Ação Kármica Error:', e);
        res.status(500).json({ erro: "O Véu rejeitou a acção kármica." });
    }
});`;

// Normalize newlines to match
const normalizedTarget = targetSnippet.replace(/\r\n/g, '\n');
const normalizedCode = code.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedTarget)) {
    const updated = normalizedCode.replace(normalizedTarget, newSnippet.replace(/\r\n/g, '\n'));
    fs.writeFileSync('server.js', updated, 'utf8');
    console.log('SUCCESS: server.js updated with 15 actions across 4 spheres!');
} else {
    console.error('ERROR: Could not find normalized targetSnippet in server.js');
}
