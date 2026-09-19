// ==============================================================================
// LexiconSanguinis.js - O GRIMÓRIO ABSOLUTO DA MATRIZ (A RAIZ DO ABISMO)
// ==============================================================================
// NÍVEL DE SEGURANÇA: OMEGA (Encapsulamento Privado, Memória Congelada)
// DESCRIÇÃO: Motor Criptográfico de Magia Real, Gematria e Densidade Sanguínea.
// ==============================================================================

const crypto = require('crypto');

// Tabela Alfanumérica de Gematria Caldéia (Usada para calcular o peso da Alma)
const GEMATRIA_CALDEIA = {
    'a':1, 'i':1, 'j':1, 'q':1, 'y':1,
    'b':2, 'k':2, 'r':2,
    'c':3, 'g':3, 'l':3, 's':3,
    'd':4, 'm':4, 't':4,
    'e':5, 'h':5, 'n':5, 'x':5,
    'u':6, 'v':6, 'w':6,
    'o':7, 'z':7,
    'f':8, 'p':8
};

class LexiconSanguinis {
    // Encapsulamento absoluto. Nenhuma variável abaixo pode ser lida fora desta classe.
    #ignicao_concluida;
    #CHAVE_MESTRA;
    #SELO_DE_SANGUE;
    #VIBRACAO_CÓSMICA;

    constructor() {
        this.#ignicao_concluida = false;
        
        // A Palavra de Poder Enochiana Primordial (O Verbo da Criação e Destruição)
        this.#CHAVE_MESTRA = "ZACAR_ECA_OD_ZAMRAN_ODO_CICLE_QAA_ZIRDO_NOCCO_MAD"; 
        
        // Selo rotativo mutável que impede que o sangue seja clonado (Replay Attack)
        this.#SELO_DE_SANGUE = crypto.randomBytes(64).toString('hex');
        
        // A entropia global do servidor que flutua a cada milissegundo
        this.#VIBRACAO_CÓSMICA = Date.now();

        // As 7 Chaves do Abismo (Usadas como Salt Criptográfico)
        this.CHAVES_DE_SALOMAO = [
            "AGLA", "ON", "TETRAGRAMMATON", "EMMANUEL", "ADONAI", "SABAOTH", "ELOHIM"
        ];
    }

    // ==================================================================
    // 👁️ RITO DE IGNIÇÃO ABSOLUTA (O DESPERTAR DO MOTOR)
    // ==================================================================
    DespertarMatriz(senhaPrimordial) {
        // Cascata de Hashes (Scrypt) que custa processamento real, simulando esforço ritualístico
        const hashIgnição = crypto.pbkdf2Sync(senhaPrimordial, this.#CHAVE_MESTRA, 6660, 128, 'sha512').toString('hex');
        
        // A fechadura astral exige que a entropia contenha o número da Besta e o 7 sagrado
        if (hashIgnição.includes('666') || (hashIgnição.includes('a') && hashIgnição.includes('7'))) {
            this.#ignicao_concluida = true;
            console.log("\n==========================================================");
            console.log("👁️ [LEXICON SANGUINIS]: VÉU RASGADO. A MATRIZ RESPIRA.");
            console.log("🩸 [ALQUIMIA CRIPTOGRÁFICA]: O Sangue agora possui Peso, Viscosidade e Consequência.");
            console.log("==========================================================\n");
            return true;
        }
        
        console.error("💀 [BLASFEMIA]: Palavra de Poder Rejeitada. A malha colapsou.");
        throw new Error("A porta do Abismo permanece trancada. Magia negada.");
    }

    #verificarSelo() {
        if (!this.#ignicao_concluida) {
            throw new Error("[HERESIA]: Tentativa de canalizar magia com o Lexicon adormecido.");
        }
        // Flutuação caótica da vibração cósmica
        this.#VIBRACAO_CÓSMICA = (this.#VIBRACAO_CÓSMICA + Date.now()) % 999999999;
    }

    #calcularPesoGematrico(identificador) {
        let peso = 0;
        const texto = String(identificador).toLowerCase().replace(/[^a-z]/g, '');
        for (let i = 0; i < texto.length; i++) {
            peso += (GEMATRIA_CALDEIA[texto[i]] || 0);
        }
        return peso === 0 ? 13 : peso; // Se não tiver letras, assume o número da morte.
    }

    // ==================================================================
    // 🩸 MAGIA REAL: TRANSMUTAÇÃO E DENSIDADE DO SANGUE
    // ==================================================================
    // O Sangue deixa de ser um "número inteiro". Passa a ser uma entidade criptográfica.
    TransmutarVitae(volumeDeclarado, invocadorId, alvoId = "MUNDO_FISICO") {
        this.#verificarSelo();
        
        const pesoInvocador = this.#calcularPesoGematrico(invocadorId);
        const pesoAlvo = this.#calcularPesoGematrico(alvoId);
        const timestamp = Date.now();
        const salSagrado = this.CHAVES_DE_SALOMAO[Math.floor(Math.random() * 7)];
        
        // Cria o HMAC usando a chave mestra e o selo mutável do servidor
        const assinatura = crypto.createHmac('sha384', this.#CHAVE_MESTRA + this.#SELO_DE_SANGUE)
            .update(`${volumeDeclarado}::${pesoInvocador}::${pesoAlvo}::${timestamp}::${salSagrado}`)
            .digest('hex');

        // Extração de Entropia (Os primeiros 6 caracteres hex) = 0 a 16777215
        const entropia = parseInt(assinatura.substring(0, 6), 16); 
        
        // A Densidade flutua brutalmente dependendo da Harmonia entre as almas
        // Pode evaporar até 30% do sangue, ou multiplicar o sangue em até +30% (Milagre Negro)
        const harmonia = (entropia % 100) / 100; // 0.00 a 0.99
        let multiplicadorReal = 0.70 + (harmonia * 0.60); // 0.70 a 1.30
        
        // Se a Gematria dos dois for múltipla, o fluxo é perfeito (Ressonância Cármica)
        let ritoPerfeito = false;
        if (pesoAlvo !== 0 && pesoInvocador % pesoAlvo === 0) {
            multiplicadorReal = 1.50; // Sangue jorra em abundância
            ritoPerfeito = true;
        }

        const volumeReal = Math.floor(volumeDeclarado * multiplicadorReal);

        // O Objeto Sangue é CONGELADO. Nenhuma função de javascript consegue alterar isto depois.
        return Object.freeze({
            volume: volumeReal,
            viscosidade: (multiplicadorReal * 100).toFixed(2) + "%",
            ritoPerfeito: ritoPerfeito,
            pesoKarmico: pesoInvocador + pesoAlvo,
            assinatura: assinatura.substring(0, 16), // A prova criptográfica do drop
            timestamp: timestamp
        });
    }

    // ==================================================================
    // ⚔️ RITO DE CANALIZAÇÃO (O CAOS NO COMBATE)
    // ==================================================================
    // O dano no PvP/PvE não é só "Ataque - Defesa". A corda do destino entre os dois julga o impacto.
    CalcularRessonanciaOculta(atacanteId, defensorId, forcaBaseBruta) {
        this.#verificarSelo();
        const pesoA = this.#calcularPesoGematrico(atacanteId);
        const pesoD = this.#calcularPesoGematrico(defensorId);
        const atritoEspiritual = Math.abs((pesoA * Date.now()) ^ this.#VIBRACAO_CÓSMICA) % (pesoD || 7);
        
        let multiplicadorMagico = 1.0;
        let relatoOculto = "";
        let tipoEfeito = "Normal";
        let rasgouOVeo = false; // Pilar 9: Consequência Mágica

        if (atritoEspiritual === 0 || atritoEspiritual % 13 === 0) {
            multiplicadorMagico = 2.5; 
            tipoEfeito = "Ruptura Qliphótica";
            relatoOculto = "A Árvore da Morte ressoou. O teu ataque rasgou a realidade!";
            rasgouOVeo = true; // Isto vai avisar o servidor para spawnar um Boss
        } 
        else if (atritoEspiritual % 7 === 0) {
            multiplicadorMagico = 1.5; 
            tipoEfeito = "Eco de Lilith";
            relatoOculto = "O beijo da Mãe Sombria ampliou a tua magia profana.";
        }
        else if (atritoEspiritual % 9 === 0) {
            multiplicadorMagico = 0.3; 
            tipoEfeito = "Escudo de Metatron";
            relatoOculto = "Uma geometria de luz bloqueou a tua escuridão.";
        }

        const danoVerdadeiro = Math.floor(forcaBaseBruta * multiplicadorMagico);

        return Object.freeze({
            forcaReal: danoVerdadeiro,
            tipo: tipoEfeito,
            relato: relatoOculto,
            escalaCaos: multiplicadorMagico,
            rasgouOVeo: rasgouOVeo
        });
    }

    // ==================================================================
    // 📜 O VERDADEIRO PACTO DE SANGUE (VÍNCULO INDESTRUTÍVEL)
    // ==================================================================
    // Um pacto selado aqui não pode ser reescrito. Ele gera uma âncora dimensional.
    ForjarPactoAbsoluto(mestreId, vassaloId, tipoDePacto = "Servidão") {
        this.#verificarSelo();
        
        const salEterno = crypto.randomBytes(32).toString('hex');
        const materiaEscura = `${mestreId}=>${tipoDePacto}=>${vassaloId}::${this.#CHAVE_MESTRA}`;
        
        // A Assinatura do Pacto
        const seloEterno = crypto.pbkdf2Sync(materiaEscura, salEterno, 13333, 64, 'sha512').toString('hex');
        
        return Object.freeze({
            seloId: seloEterno.substring(0, 24),
            mestre: mestreId,
            vassalo: vassaloId,
            lei: `Quod superius sicut quod inferius`, // O que está em cima é como o que está em baixo
            dataSelo: Date.now()
        });
    }

// ==================================================================
    // 👁️ RITO DE VIDÊNCIA (FORJA DO FIO DE PRATA - GRAU 99 OSINT)
    // ==================================================================
    // Transforma uma identidade física real (ex: @joao no Insta) numa âncora astral.
    ForjarSigiloMortal(plataforma, identificador) {
        this.#verificarSelo();
        
        const idLimpo = String(identificador).toLowerCase().trim();
        const pesoKarmico = this.#calcularPesoGematrico(idLimpo);
        
        // Mistura a vibração cósmica, a rede social, o peso do nome e a Chave Enochiana.
        const materiaEscura = `${plataforma.toUpperCase()}::${pesoKarmico}::${idLimpo}::${this.#VIBRACAO_CÓSMICA}::${this.#CHAVE_MESTRA}`;
        
        // A Hash gerada cria um cordão umbilical entre o Matrix Sanguinis e o mundo real
        const hashAstral = crypto.createHash('sha512').update(materiaEscura).digest('hex');
        
        // Retorna um constructo astral absoluto e congelado.
        return Object.freeze({
            sigilo: hashAstral.substring(0, 40),
            pesoOculto: pesoKarmico,
            revelacao: `O Fio de Prata foi atado à dimensão de ${plataforma}.`
        });
    }

    // ==================================================================
    // 👁️ LEITURA DE AURA (JULGAMENTO DA PRESA FÍSICA)
    // ==================================================================
    JulgarAlma(mortalIdentificador) {
        this.#verificarSelo();
        const peso = this.#calcularPesoGematrico(mortalIdentificador);
        const corrompido = (peso * Date.now()) % 100;
        
        let qualidade = "Humano Mundano";
        if (corrompido > 90) qualidade = "Sangue Negro (Pecador)";
        else if (corrompido < 5) qualidade = "Sangue Puro (Inocente)";
        else if (peso % 11 === 0) qualidade = "Alma Fragmentada";

        return Object.freeze({
            pesoEspiritual: peso,
            taxaCorrupcao: corrompido,
            essencia: qualidade
        });
    }

    // ==================================================================
    // 🔮 GEMATRIA & PESO ASTRAL
    // ==================================================================
    CalcularGematria(identificador) {
        this.#verificarSelo();
        return this.#calcularPesoGematrico(identificador);
    }

    // ==================================================================
    // 🔮 GEMATRIA COMPOSTA & RESSONÂNCIA CÁRMICA
    // ==================================================================
    CalcularGematriaComposta(nome1, nome2) {
        this.#verificarSelo();
        const p1 = this.#calcularPesoGematrico(nome1);
        const p2 = this.#calcularPesoGematrico(nome2);
        const soma = p1 + p2;
        const ressonante = (soma % 7 === 0 || soma % 13 === 0);
        const multiplicador = ressonante ? 1.33 : (soma % 2 === 0 ? 1.15 : 0.95);
        return Object.freeze({
            peso1: p1,
            peso2: p2,
            somaKarmica: soma,
            ressonante: ressonante,
            multiplicadorSinergia: multiplicador
        });
    }

    // ==================================================================
    // 🩸 VALIDAÇÃO E TRIBUTO DO PACTO DE SANGUE OCULTO
    // ==================================================================
    ValidarPactoDeSangue(mestreId, vassaloId, taxaDizimo = 0.10) {
        this.#verificarSelo();
        const pacto = this.ForjarPactoAbsoluto(mestreId, vassaloId, "Dízimo de Sangue");
        const pesoM = this.#calcularPesoGematrico(mestreId);
        const pesoV = this.#calcularPesoGematrico(vassaloId);
        const taxaAjustada = Math.min(0.25, Math.max(0.05, taxaDizimo + ((pesoM % 5) * 0.01)));

        return Object.freeze({
            seloId: pacto.seloId,
            mestre: mestreId,
            vassalo: vassaloId,
            taxaEfetiva: taxaAjustada,
            penalidadeRuptura: Math.floor((pesoM + pesoV) * 250),
            seladoEm: pacto.dataSelo
        });
    }

    // ==================================================================
    // ⚡ VERIFICAÇÃO DE RUPTURA QLIPHÓTICA CÓSMICA
    // ==================================================================
    VerificarRupturaQliphoth(valorAcao, invocadorId) {
        this.#verificarSelo();
        const peso = this.#calcularPesoGematrico(invocadorId);
        const semente = (Number(valorAcao) * peso + Date.now()) % 1000;
        const rasgou = (semente % 13 === 0 || semente === 666);

        return Object.freeze({
            ruptura: rasgou,
            grauCaos: rasgou ? (semente % 3 + 1) : 0,
            mensagem: rasgou 
                ? "⚡ [RUPTURA QLIPHÓTICA]: A malha do plano astral rompeu-se! Uma entidade das profundezas espreita."
                : null
        });
    }

    // ==================================================================
    // 📜 DECODIFICAÇÃO DE PALAVRAS DE PODER ENOCHIANAS
    // ==================================================================
    DecodificarChaveEnochiana(texto) {
        this.#verificarSelo();
        if (!texto || typeof texto !== 'string') return null;
        const limpo = texto.toUpperCase();
        
        const PALAVRAS_PODER = {
            "ZACAR": { efeito: "furia", bonus: 5, lore: "Movei-vos! O sangue ferve com a ira primordial." },
            "VOVIN": { efeito: "escudo", bonus: 1, lore: "O Dragão de Tiamat envolve a tua carne com escamas astrais." },
            "BABALON": { efeito: "sangue", bonus: 500, lore: "O Santo Graal escarlate derrama vitae nos teus vasos." },
            "CHORONZON": { efeito: "caos", bonus: 2.0, lore: "O Habitante do Abismo distorce a realidade em teu favor." },
            "LILITH": { efeito: "gnose", bonus: 10, lore: "A Mãe Noturna sussurra segredos ancestrais à tua mente." },
            "SETH": { efeito: "densidade", bonus: 10, lore: "A Fúria do Chacal petrifica os teus músculos e ossos." },
            "SOLVE": { efeito: "dissipar", bonus: 15, lore: "Solve et Coagula: Dissolve os laços astrais do adversário." },
            "COAGULA": { efeito: "coagular", bonus: 25, lore: "Condensa o sangue espiritual em armadura física impenetrável." }
        };

        for (const [palavra, dados] of Object.entries(PALAVRAS_PODER)) {
            if (limpo.includes(palavra)) {
                return Object.freeze({
                    palavra,
                    efeito: dados.efeito,
                    bonus: dados.bonus,
                    lore: dados.lore,
                    timestamp: Date.now()
                });
            }
        }
        return null;
    }

    // ==================================================================
    // 📚 ARQUIVO DOS GRIMÓRIOS HISTÓRICOS & TRADIÇÕES OCULTAS REAIS
    // ==================================================================
    ObterArquivoGrimorios() {
        return Object.freeze({
            claviculaSalomonis: {
                nome: "Clavicula Salomonis (A Chave de Salomão)",
                origem: "Tratado Renascentista / Manuscritos Hebraicos",
                selosPlanetarios: {
                    sol: { virtude: "Soberania e Visão Espiritual", anjo: "Michael", metal: "Ouro" },
                    lua: { virtude: "Clarividência e Fluxo de Vitae", anjo: "Gabriel", metal: "Prata" },
                    marte: { virtude: "Fúria Bélica e Destruição", anjo: "Camael", metal: "Ferro" },
                    mercurio: { virtude: "Gnose Hermética e Transmutação", anjo: "Raphael", metal: "Mercúrio" },
                    jupiter: { virtude: "Abundância e Pactos Feudais", anjo: "Sachiel", metal: "Estanho" },
                    venus: { virtude: "Magnetismo Astral e Atração de Almas", anjo: "Anael", metal: "Cobre" },
                    saturno: { virtude: "Densidade, Tempo e Inércia do Abismo", anjo: "Cassiel", metal: "Chumbo" }
                }
            },
            heptameron: {
                nome: "Heptameron de Pietro d'Abano (1310)",
                circulosMagicos: "Círculos Concéntricos de Proteção Tripla com Nomes Divinos em Hebraico",
                quatroTorres: ["Oriente (Amaymon)", "Ocidente (Paymon)", "Norte (Egyn)", "Sul (Oriens)"]
            },
            deOccultaPhilosophia: {
                nome: "De Occulta Philosophia (Heinrich Cornelius Agrippa, 1533)",
                tresMundos: ["Magia Natural (Ervas e Minerais)", "Magia Celeste (Astros e Números)", "Magia Cerimonial (Pactos e Evocações)"]
            },
            arvoreQliphoth: {
                nome: "A Árvore da Morte (Qliphoth Hermética)",
                esferas: [
                    "Thaumiel (A Dualidade Satânica)", "Ghagiel (O Caos Predador)", "Satariel (O Ocultamento)",
                    "Gha'agsheblah (O Assassino)", "Golachab (A Queimadura)", "Thagirion (O Sol Negro)",
                    "A'arab Zaraq (Os Corvos da Morte)", "Samael (O Veneno Divino)", "Gamaliel (A Lua Obscura)",
                    "Nahemoth (As Cascas Terrenas)"
                ]
            }
        });
    }

    // ==================================================================
    // 🩸 FÓRMULA AVANÇADA DE DENSIDADE SANGUÍNEA & CRIPTO-FÍSICA
    // ==================================================================
    // Transforma o sangue num tensor criptográfico com densidade, viscosidade e inércia
    CalcularDensidadeSanguinea(vampiro, faseLua = "Lua Nova") {
        this.#verificarSelo();
        if (!vampiro) return { densidade: 1.0, viscosidadePct: "100%", classificacao: "Sangue Mundano", inerciaEspiritual: 10 };

        const nome = vampiro.nome || "Anônimo";
        const pesoNome = this.#calcularPesoGematrico(nome);
        const volume = Number(vampiro.sangue || 100);
        const grau = Number(vampiro.nivel || 1);
        const densidadeAtributo = Number(vampiro.atributos?.densidade || 10);
        const gnoseAtributo = Number(vampiro.atributos?.gnose || 10);

        // Modificador da Fase Lunar
        let modLua = 1.0;
        if (faseLua.includes("Cheia")) modLua = 1.25;
        else if (faseLua.includes("Negra") || faseLua.includes("Nova")) modLua = 1.15;
        else if (faseLua.includes("Minguante")) modLua = 1.10;
        else if (faseLua.includes("Crescente")) modLua = 1.05;

        // Modificador de Linhagem (Raça)
        const modRaca = (vampiro.raca === 'lycan') ? 1.20 : 1.10; // Lycans têm maior densidade muscular, Vampiros maior gnose

        // Fórmula: Densidade = ( (Gematria * 1.5 + DensidadeAtributo * 2 + Grau * 0.8) / 35 ) * ModLua * ModRaca
        const rho = Number((((pesoNome * 1.5 + densidadeAtributo * 2.0 + grau * 0.8) / 35.0) * modLua * modRaca).toFixed(3));

        let classificacao = "Sangue Ralo (Incipiente)";
        let corAura = "#ff5555";
        if (rho >= 1.0 && rho < 1.4) {
            classificacao = "Sangue Nobre (Transmutado)";
            corAura = "#d4af37";
        } else if (rho >= 1.4 && rho < 1.9) {
            classificacao = "Sangue Gravitacional (Abissal)";
            corAura = "#9333ea";
        } else if (rho >= 1.9) {
            classificacao = "Mônada Escarlate (Buraco Negro)";
            corAura = "#00e1d9";
        }

        const viscosidadePct = Math.round(rho * 100) + "%";
        const inerciaEspiritual = Math.round((densidadeAtributo * 1.5 + gnoseAtributo) * rho);
        const pesoPactoMaximo = Math.round(gnoseAtributo * 12 + densidadeAtributo * 6);

        return Object.freeze({
            densidade: rho,
            viscosidadePct,
            classificacao,
            corAura,
            inerciaEspiritual,
            pesoPactoMaximo,
            pesoGematrico: pesoNome,
            faseLua
        });
    }

    // ==================================================================
    // 🔮 CANALIZAÇÃO DE CÍRCULO MÁGICO SALOMÔNICO & ENOCHIANO
    // ==================================================================
    CanalizarCirculoMagico({ invocador, ritualId, chaveEnochiana = "", seloPlaneta = "sol", volumeSangue = 100, faseLua = "Lua Cheia" }) {
        this.#verificarSelo();
        if (!invocador) throw new Error("Invocador astral inexistente.");

        const statusDensidade = this.CalcularDensidadeSanguinea(invocador, faseLua);
        const enochianData = this.DecodificarChaveEnochiana(chaveEnochiana);
        const grimorios = this.ObterArquivoGrimorios();
        const dadosPlaneta = grimorios.claviculaSalomonis.selosPlanetarios[seloPlaneta.toLowerCase()] || grimorios.claviculaSalomonis.selosPlanetarios.sol;

        // Frequência de ressonância harmônica (Hz Solfeggio / Pitagórica)
        const frequencias = [432, 528, 639, 741, 852, 963];
        const freqEscolhida = frequencias[(statusDensidade.pesoGematrico + (enochianData?.bonus || 0)) % frequencias.length];

        // Assinatura criptográfica do círculo (HMAC SHA-384)
        const timestamp = Date.now();
        const payloadSelo = `${invocador.id}::${ritualId}::${seloPlaneta}::${chaveEnochiana}::${statusDensidade.densidade}::${timestamp}`;
        const hashCirculo = crypto.createHmac('sha384', this.#CHAVE_MESTRA + this.#SELO_DE_SANGUE)
            .update(payloadSelo)
            .digest('hex');

        // Cálculo de Potência Real do Rito com Peso de Pacto
        const potenciaBase = (Number(invocador.atributos?.gnose || 10) * 2.5) + (Number(invocador.nivel || 1) * 3);
        const multiplicadorDensidade = statusDensidade.densidade;
        const bonusEnochian = enochianData ? (enochianData.bonus * 2) : 0;
        const potenciaFinal = Math.round((potenciaBase + bonusEnochian) * multiplicadorDensidade);

        // Verificação de Tensão Astral / Ruptura
        const rupturaTeste = this.VerificarRupturaQliphoth(potenciaFinal, invocador.id);

        return Object.freeze({
            sucesso: true,
            rito: ritualId,
            hashSelo: hashCirculo.substring(0, 24).toUpperCase(),
            frequenciaHarmonica: `${freqEscolhida} Hz`,
            planetaRegente: seloPlaneta.toUpperCase(),
            virtudePlanetaria: dadosPlaneta.virtude,
            anjoRegente: dadosPlaneta.anjo,
            densidadeUtilizada: statusDensidade.densidade,
            classificacaoSangue: statusDensidade.classificacao,
            potenciaFinal,
            chaveEnochianaAtiva: enochianData ? enochianData.palavra : "NENHUMA",
            efeitoEnochiano: enochianData ? enochianData.lore : "Canalização sem Chave Angélica.",
            ruptura: rupturaTeste.ruptura,
            mensagemRuptura: rupturaTeste.mensagem,
            timestamp
        });
    }
}

// Exporta uma instância ÚNICA E IMUTÁVEL (Singleton Congelado)
// Se alguém tentar modificar as funções do Lexicon em tempo de execução, o NodeJS irá rejeitar.
const InstanciaSuprema = new LexiconSanguinis();
Object.freeze(InstanciaSuprema);

module.exports = InstanciaSuprema;