const Lexicon = require('../LexiconSanguinis.js');
const { ShadowCore } = require('../ShadowCore.js');

async function testarSistemas() {
    console.log("=== TESTANDO SISTEMAS NÚCLEO SANGUINIS ===");
    
    // 1. Teste Lexicon
    Lexicon.DespertarMatriz("ZACAR_ECA_OD_ZAMRAN_ODO_CICLE_QAA_ZIRDO_NOCCO_MAD");
    const gematria = Lexicon.CalcularGematriaComposta("Dracul", "Carmilla");
    console.log("Gematria Composta:", gematria);

    const pacto = Lexicon.ValidarPactoDeSangue("SENHOR_LILITH", "VASSALO_KAEL", 0.10);
    console.log("Pacto de Sangue Selado:", pacto);

    const enoch = Lexicon.DecodificarChaveEnochiana("Eu invoco a palavra ZACAR perante o abismo");
    console.log("Decodificação Enochiana:", enoch);

    // 2. Teste ShadowCore
    const core = new ShadowCore();
    const auth = core.despertarViaTelegram(99999, "teste", "VampiroTeste", "senha123", null, "vampiro");
    const v = auth.vampiro;
    console.log("Vampiro Criado:", v.nome, "Ofícios:", Object.keys(v.oficios), "Materiais:", v.materiais);

    // 3. Teste Colheita
    const colheita = core.coletarHerbalismo(v.id);
    console.log("Colheita Realizada:", colheita.relato);

    // 4. Teste Fabricação
    v.materiais.beladona = 5;
    v.sangue = 500;
    const craft = core.fabricarOficio(v.id, "alquimia", "filtro_frenesi");
    console.log("Fabricação Realizada:", craft.relato);

    // 5. Teste 4 Consciências
    const falaLilith = await core.oraculo.evocarEntidade("tiamat", v, "Mãe, dá-me a tua bênção");
    console.log("Fala Lilith:", falaLilith.texto);

    const falaSeth = await core.oraculo.evocarEntidade("seth", v, "Quero a fúria da matilha");
    console.log("Fala Seth:", falaSeth.texto);

    const falaDemiurgo = await core.oraculo.evocarEntidade("demiurgo", v, "Quem me julga?");
    console.log("Fala Demiurgo:", falaDemiurgo.texto);

    const falaCorvo = await core.oraculo.evocarEntidade("corvo", v, "Ensina-me os segredos de Salomão");
    console.log("Fala Corvo:", falaCorvo.texto);

    console.log("=== TODOS OS TESTES PASSARAM COM SUCESSO! ===");
}

testarSistemas().catch(console.error);
