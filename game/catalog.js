'use strict';

const zones = [
  { id: 'noctis', name: 'Cidadela de Noctis', subtitle: 'O último refúgio antes da noite', type: 'Santuário', level: 1, art: 'noctis', color: '#b59c72', safe: true, description: 'Sob as torres da antiga corte, vampiros e lobisomens respeitam uma trégua frágil. Aqui você forja relíquias, encontra sua ordem e se prepara para atravessar o véu.' },
  { id: 'forest', name: 'Floresta dos Lamentos', subtitle: 'Algo desperta entre os espinhos', type: 'Exploração · PvE', level: 1, art: 'hunt', color: '#83ada6', description: 'Explore a névoa, colha lótus negro e cace os devoradores que rondam o bosque. Esquive das áreas marcadas antes que as garras encontrem sua carne.' },
  { id: 'crypt', name: 'Cripta de Salomão', subtitle: 'Nem todo conhecimento deve ser encontrado', type: 'Masmorra cooperativa', level: 3, art: 'ritual', color: '#ad84bc', description: 'Uma expedição compartilhada para até quatro membros do seu grupo. O Guardião do Véu protege relíquias e cinzas ancestrais. Sem grupo, a cripta é uma expedição solo.' },
  { id: 'war', name: 'Ermos da Lua Sangrenta', subtitle: 'As linhagens não esqueceram', type: 'Guerra · PvP', level: 2, art: 'war', color: '#c14d56', description: 'Na lua cheia, a trégua acaba. Domine o obelisco junto à sua linhagem. Rivais no mesmo campo podem atacar você; permanecer no círculo conquista influência para sua espécie.' },
  { id: 'altar', name: 'Altar do Primeiro Sangue', subtitle: 'Toda dádiva exige um sacrifício', type: 'Rituais · Ocultismo', level: 1, art: 'ritual', color: '#b69772', safe: true, description: 'A magia do antigo Lexicon vive nos sigilos. Memorize a sequência, trace o círculo e sele um pacto com Lilith, Seth ou o Dragão. Seus efeitos mudam a batalha.' }
];
const lineages = [
  { id: 'vampire', name: 'Vampiro', house: 'Corte Carmesim', title: 'A eternidade tem um preço.', art: 'vampire', color: '#bd4b56', description: 'Controle o campo com magia de sangue, drene a vida dos adversários e atravesse as sombras.', bonus: 'Dreno vital · afinidade arcana' },
  { id: 'lycan', name: 'Lobisomem', house: 'Matilha da Lua', title: 'A lua conhece seu nome.', art: 'lycan', color: '#ad9a78', description: 'Cace com sentidos ancestrais, rompa a postura dos inimigos e desperte o frenesi da lua cheia.', bonus: 'Força brutal · velocidade de caça' }
];
const skills = [
  { id: 'strike', key: '1', name: 'Corte ancestral', lycan: 'Garras ancestrais', cost: 0, cooldown: 650, range: 105, damage: 22, posture: 16, icon: 'sword', description: 'Golpe rápido em cone. Aproxime-se e mire com o cursor.' },
  { id: 'blood', key: '2', name: 'Lança de sangue', lycan: 'Uivo dilacerante', cost: 22, cooldown: 3800, range: 330, damage: 38, posture: 18, icon: 'drop', description: 'Projétil arcano. Vampiros recuperam vida ao atingir; lobisomens causam dano adicional.' },
  { id: 'heavy', key: '3', name: 'Ruptura do véu', lycan: 'Fúria da matilha', cost: 30, cooldown: 7000, range: 150, damage: 55, posture: 45, icon: 'flame', description: 'Explosão em área que rompe postura. Inimigos vulneráveis recebem dano dobrado.' },
  { id: 'ward', key: '4', name: 'Selo de proteção', lycan: 'Pele de prata', cost: 25, cooldown: 13000, range: 0, damage: 0, posture: 0, icon: 'shield', description: 'Reduz o dano recebido por 4 segundos e restaura 15 pontos de vida.' },
  { id: 'dash', key: 'Espaço', name: 'Passo sombrio', lycan: 'Salto predador', cost: 14, cooldown: 2400, range: 0, damage: 0, posture: 0, icon: 'wind', description: 'Esquiva na direção do movimento. Breve invulnerabilidade durante o deslocamento.' }
];
const recipes = [
  { id: 'elixir', name: 'Elixir de vitae', icon: 'drop', description: 'Restaura 65 de vida em combate.', cost: { lotus: 3, ash: 1 }, price: 20 },
  { id: 'blade', name: 'Athame de obsidiana', icon: 'sword', description: 'Arma rara · +8 de dano em todos os golpes.', cost: { iron: 5, ash: 3 }, price: 80, slot: 'weapon', power: 8 },
  { id: 'amulet', name: 'Selo de Salomão', icon: 'diamond', description: 'Amuleto raro · +35 de vida máxima.', cost: { iron: 3, lotus: 5 }, price: 60, slot: 'amulet', power: 35 }
];
const talents = [
  { id: 'fangs', name: 'Sede ancestral', branch: 'Sangue', icon: 'drop', description: '+4 de dano por grau.', max: 3 },
  { id: 'veil', name: 'Carne do véu', branch: 'Sombra', icon: 'shield', description: '+20 de vida máxima por grau.', max: 3 },
  { id: 'gnosis', name: 'Gnose proibida', branch: 'Ocultismo', icon: 'eye', description: '+10 de essência máxima por grau.', max: 3 }
];
const quests = [
  { id: 'hunt', name: 'Sussurros na névoa', description: 'Derrote 5 devoradores na Floresta dos Lamentos.', goal: 5, xp: 220, gold: 90, icon: 'sword' },
  { id: 'gather', name: 'A matéria da noite', description: 'Colete 4 veios ou lótus no mundo.', goal: 4, xp: 140, gold: 60, icon: 'leaf' },
  { id: 'ritual', name: 'O primeiro círculo', description: 'Complete um ritual no Altar do Primeiro Sangue.', goal: 1, xp: 180, gold: 70, icon: 'ritual' },
  { id: 'boss', name: 'O nome sob a pedra', description: 'Derrote o Guardião do Véu na Cripta de Salomão.', goal: 1, xp: 500, gold: 200, icon: 'skull' },
  { id: 'war', name: 'Herdeiros da lua', description: 'Participe de 10 pulsos de captura durante a lua cheia.', goal: 10, xp: 300, gold: 120, icon: 'flag' }
];
const pacts = [
  { id: 'lilith', name: 'Pacto de Lilith', key: 'LILITH', sigil: '☾', benefit: '+15% de dano arcano por 10 minutos', description: 'A primeira mãe empresta sua voz ao seu sangue.' },
  { id: 'seth', name: 'Pacto de Seth', key: 'SETH', sigil: '△', benefit: '+15% de dano físico por 10 minutos', description: 'O chacal abre um caminho onde havia apenas pedra.' },
  { id: 'dragon', name: 'Manto de Vovin', key: 'VOVIN', sigil: '◇', benefit: 'Reduz dano recebido em 15% por 10 minutos', description: 'Escamas astrais cobrem a carne da sua linhagem.' }
];
module.exports = { zones, lineages, skills, recipes, talents, quests, pacts, materials: { lotus: 'Lótus negro', iron: 'Ferro negro', ash: 'Cinzas ancestrais' } };
