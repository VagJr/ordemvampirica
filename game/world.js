'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('./catalog');
const Lexicon = require('../LexiconSanguinis');
const { CodeMagicEngine, GRAUS_INICIATICOS } = require('../OrdemMagicaCore');
const Loot = require('../GeradorDeItensProcedural');
Lexicon.DespertarMatriz('SANGUINIS_REWORK');
const magic = new CodeMagicEngine({});
const WIDTH = 1400, HEIGHT = 900;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const fail = message => { throw new Error(message); };

class World {
  constructor({ file = path.join(process.env.SANGUINIS_DATA_DIR || path.join(__dirname, '../data'), 'rework-world.json'), now = () => Date.now() } = {}) {
    this.file = file; this.now = now; this.players = {}; this.accounts = {}; this.sessions = {};
    this.guilds = {}; this.market = []; this.parties = {}; this.chat = []; this.online = new Map();
    this.inputs = new Map(); this.effects = []; this.challenges = new Map(); this.scoredKills = new Map();
    this.war = { vampire: 0, lycan: 0, control: 0, owner: null, lastCapture: 0, cycle: Math.floor(this.now() / 1800000) };
    this.load(); this.rooms = {};
    for (const z of catalog.zones) if (z.id !== 'crypt') this.rooms[z.id] = this.makeRoom(z.id);
    this.lastTick = this.now(); this.lastRegen = this.now();
  }
  load() {
    if (!this.file || !fs.existsSync(this.file)) return;
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    for (const key of ['players', 'accounts', 'sessions', 'guilds', 'market', 'war', 'platform']) if (data[key]) this[key] = data[key];
    for (const p of Object.values(this.players)) { p.zone = 'noctis'; p.x = 700; p.y = 540; p.cooldowns = {}; p.deadUntil = 0; p.party = null; }
    for (const [key, s] of Object.entries(this.sessions)) if (s.expires < this.now()) delete this.sessions[key];
  }
  save() {
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const payload = Object.fromEntries(['players', 'accounts', 'sessions', 'guilds', 'market', 'war', 'platform'].map(k => [k, this[k]]));
    const temp = this.file + '.tmp';
    fs.writeFileSync(temp, JSON.stringify({ version: 2, ...payload }));
    fs.renameSync(temp, this.file);
  }
  createPlayer(name, species) {
    name = String(name || '').trim();
    if (!/^[\p{L}\p{N} _'-]{3,22}$/u.test(name)) fail('Use um nome de 3 a 22 letras ou números.');
    if (!catalog.lineages.some(x => x.id === species)) fail('Escolha uma linhagem.');
    if (Object.values(this.players).some(p => p.name.toLowerCase() === name.toLowerCase())) fail('Esse nome já pertence a outra sombra.');
    const p = { id: crypto.randomUUID(), name, species, level: 1, xp: 0, gold: 120, hp: 140, essence: 100,
      zone: 'noctis', x: 700, y: 540, face: 0, cooldowns: {}, deadUntil: 0, talents: {}, points: 1,
      materials: { lotus: 0, iron: 0, ash: 0 }, items: [{ id: crypto.randomUUID(), type: 'elixir', name: 'Elixir de vitae', quantity: 2 }],
      equipment: {}, quests: {}, claimed: [], pact: null, kills: 0, pvpKills: 0, guild: null, discovered: ['noctis'], created: this.now() };
    this.players[p.id] = p; return p;
  }
  stats(p) {
    const g = this.guilds[p.guild], attuned = (g?.matrix || []).filter(n => n.members.includes(p.id));
    return { maxHp: 140 + (p.level - 1) * 18 + (p.talents.veil || 0) * 20 + (p.equipment.amulet?.power || 0) + (p.realm?.buildings.wall || 0) * 8 + attuned.filter(n => n.type === 'protecao_santuario' || n.type === 'manto_astral').length * 12,
      maxEssence: 100 + (p.talents.gnosis || 0) * 10 + (p.realm?.buildings.tower || 0) * 5,
      damage: Math.round(((p.level - 1) * 3 + (p.talents.fangs || 0) * 4 + (p.equipment.weapon?.power || 0) + attuned.filter(n => n.type === 'ressonancia').length * 4) * (1 + (p.cycles || 0) * 0.1)) };
  }
  publicPlayer(p) { return { id: p.id, name: p.name, species: p.species, level: p.level, hp: p.hp, maxHp: this.stats(p).maxHp, x: p.x, y: p.y, face: p.face, zone: p.zone, guild: p.guild, ward: p.wardUntil > this.now(), dead: p.deadUntil > this.now(), party: p.party || null }; }
  privatePlayer(p) {
    const { cooldowns, ...rest } = p;
    return { ...rest, ...this.stats(p), cooldowns, nextXp: this.nextXp(p), grade: GRAUS_INICIATICOS[Math.min(10, Math.floor((p.level - 1) / 3))].titulo };
  }
  matrixNodes(p) { return (this.guilds[p.guild]?.matrix || []).filter(n => n.members.includes(p.id)); }
  session(id) {
    const token = crypto.randomBytes(32).toString('hex');
    this.sessions[token] = { id, expires: this.now() + 30 * 86400000 }; return token;
  }
  authenticate(token) {
    const s = this.sessions[token]; return s && s.expires > this.now() ? this.players[s.id] : null;
  }
  connect(id, socketId) {
    this.online.set(id, socketId); this.inputs.set(id, { x: 0, y: 0 });
    if (!this.players[id].zone.startsWith('crypt')) return;
    this.players[id].zone = 'noctis'; this.players[id].x = 700; this.players[id].y = 540;
  }
  disconnect(id, socketId) { if (this.online.get(id) === socketId) { this.online.delete(id); this.inputs.delete(id); this.challenges.delete(id); } }
  makeRoom(zone) {
    const base = zone.split(':')[0], room = { id: zone, mobs: [], nodes: [] };
    if (base === 'forest' || base === 'war' || base === 'crypt') {
      const amount = base === 'crypt' ? 5 : 8;
      for (let i = 0; i < amount; i++) {
        const boss = base === 'crypt' && i === 0;
        const x = boss ? 970 : 240 + (i * 173) % 980, y = boss ? 320 : 180 + (i * 127) % 480;
        room.mobs.push({ id: `${zone}:mob:${i}`, name: boss ? 'Guardião do Véu' : base === 'war' ? 'Espectro da guerra' : 'Devorador da névoa',
          x, y, home: { x, y }, hp: boss ? 900 : 100, maxHp: boss ? 900 : 100, posture: 100, boss, attackAt: 0, cooldown: 0, respawnAt: 0, contributions: {}, staggerUntil: 0 });
      }
      for (let i = 0; i < 8; i++) room.nodes.push({ id: `${zone}:node:${i}`, x: 180 + i * 147, y: 640 + (i % 2) * 65, type: i % 2 ? 'iron' : 'lotus', readyAt: 0 });
    }
    return room;
  }
  room(p) { return this.rooms[p.zone]; }
  travel(p, id) {
    this.assertAlive(p);
    const zone = catalog.zones.find(z => z.id === id); if (!zone) fail('Região desconhecida.');
    if (p.level < zone.level) fail(`Esta região exige nível ${zone.level}.`);
    if (p.lastTravel && this.now() - p.lastTravel < 2500) fail('A passagem ainda está se abrindo.');
    p.lastTravel = this.now();
    if (id === 'crypt') { id = `crypt:${p.party || p.id}`; if (!this.rooms[id]) this.rooms[id] = this.makeRoom(id); }
    p.zone = id; p.x = 700; p.y = 740; this.inputs.set(p.id, { x: 0, y: 0 }); this.challenges.delete(p.id);
    if (!p.discovered.includes(zone.id)) p.discovered.push(zone.id);
    return { message: `Você atravessou o véu: ${zone.name}.` };
  }
  assertAlive(p) { if (p.deadUntil > this.now()) fail('Sua sombra ainda está retornando ao santuário.'); }
  move(p, input) {
    if (!input || !Number.isFinite(input.x) || !Number.isFinite(input.y)) return;
    const len = Math.max(1, Math.hypot(input.x, input.y));
    this.inputs.set(p.id, { x: clamp(input.x / len, -1, 1), y: clamp(input.y / len, -1, 1) });
    if (Number.isFinite(input.face)) p.face = input.face;
  }
  effect(type, p, extra = {}) { this.effects.push({ id: crypto.randomUUID(), type, zone: p.zone, x: p.x, y: p.y, at: this.now(), ...extra }); }
  skill(p, id, aim) {
    this.assertAlive(p);
    const skill = catalog.skills.find(s => s.id === id); if (!skill) fail('Habilidade desconhecida.');
    const now = this.now(); if ((p.cooldowns[id] || 0) > now) fail('A habilidade ainda está recarregando.');
    if (p.essence < skill.cost) fail('Essência insuficiente.');
    const face = Number.isFinite(aim?.x) && Number.isFinite(aim?.y) ? Math.atan2(aim.y - p.y, aim.x - p.x) : p.face;
    p.essence -= skill.cost; p.cooldowns[id] = now + skill.cooldown; p.face = face;
    if (id === 'dash') {
      const input = this.inputs.get(p.id) || { x: 0, y: 0 }; const angle = input.x || input.y ? Math.atan2(input.y, input.x) : face;
      p.x = clamp(p.x + Math.cos(angle) * 140, 45, WIDTH - 45); p.y = clamp(p.y + Math.sin(angle) * 140, 70, HEIGHT - 45);
      p.invulnerableUntil = now + 420; this.effect('dash', p, { face: angle }); return {};
    }
    if (id === 'ward') { p.wardUntil = now + 4000; p.hp = Math.min(this.stats(p).maxHp, p.hp + 15); this.effect('ward', p); return {}; }
    this.effect(id, p, { face, range: skill.range, species: p.species });
    const inRange = target => {
      if (dist(p, target) > skill.range) return false;
      const delta = Math.atan2(Math.sin(Math.atan2(target.y - p.y, target.x - p.x) - face), Math.cos(Math.atan2(target.y - p.y, target.x - p.x) - face));
      return id === 'heavy' || Math.abs(delta) < (id === 'blood' ? 0.27 : 1.15);
    };
    const boost = p.pact && p.pact.until > now && ((id === 'blood' && p.pact.id === 'lilith') || (id !== 'blood' && p.pact.id === 'seth')) ? 1.15 : 1;
    const moonBoost = p.species === 'lycan' && this.moon().full ? 1.2 : p.species === 'vampire' && id === 'blood' ? 1.1 : 1;
    let damage = Math.round((skill.damage + this.stats(p).damage) * boost * moonBoost);
    if (p.species === 'lycan' && id === 'blood') damage += 8;
    for (const mob of this.room(p).mobs) {
      if (mob.hp <= 0 || !inRange(mob)) continue;
      const hit = damage * (mob.staggerUntil > now ? 2 : 1);
      mob.hp = Math.max(0, mob.hp - hit); mob.posture = Math.max(0, mob.posture - skill.posture);
      mob.contributions[p.id] = (mob.contributions[p.id] || 0) + hit;
      if (mob.posture <= 0) { mob.staggerUntil = now + 3500; mob.posture = 100; mob.attackAt = 0; }
      this.effect('damage', p, { x: mob.x, y: mob.y, value: hit });
      if (id === 'blood' && p.species === 'vampire') p.hp = Math.min(this.stats(p).maxHp, p.hp + Math.round(hit * 0.18));
      if (mob.hp === 0) this.killMob(mob, p);
    }
    if (p.zone === 'war' && this.moon().full) for (const other of this.activePlayers('war')) {
      if (other.species === p.species || other.deadUntil > now || !inRange(other)) continue;
      const alive = other.hp > 0; this.hurt(other, damage);
      if (alive && other.hp <= 0) {
        const pair = `${p.id}:${other.id}`;
        if ((this.scoredKills.get(pair) || 0) < now) { p.pvpKills++; this.war[p.species] += 20; this.gainXp(p, 40); this.scoredKills.set(pair, now + 300000); }
      }
    }
    return {};
  }
  hurt(p, damage) {
    if (p.invulnerableUntil > this.now() || p.deadUntil > this.now()) return;
    if (p.wardUntil > this.now()) damage *= 0.3;
    if (p.pact?.id === 'dragon' && p.pact.until > this.now()) damage *= 0.85;
    const matrix = this.matrixNodes(p);
    if (matrix.some(n => n.type === 'protecao_santuario')) damage *= 0.95;
    if (matrix.some(n => n.type === 'maldicao_carmica')) damage *= 0.95;
    if (matrix.some(n => n.type === 'territorio_sagrado') && dist(p,{x:700,y:360}) < 180) damage *= 0.9;
    const g = this.guilds[p.guild];
    if (g?.rite?.until > this.now() && g.rite.members.includes(p.id)) damage *= 0.85;
    p.hp = Math.max(0, p.hp - Math.round(damage)); this.effect('hurt', p, { value: Math.round(damage) });
    if (p.hp === 0) { p.deadUntil = this.now() + 4500; this.inputs.set(p.id, { x: 0, y: 0 }); this.challenges.delete(p.id); }
  }
  killMob(mob, killer) {
    mob.respawnAt = this.now() + (mob.boss ? 90000 : 20000); mob.attackAt = 0;
    for (const [id, contributed] of Object.entries(mob.contributions)) {
      const p = this.players[id];
      if (!p || !this.online.has(id) || p.zone !== killer.zone || contributed < mob.maxHp * 0.05) continue;
      this.gainXp(p, mob.boss ? 250 : 38); p.gold += mob.boss ? 100 : 14;
      p.kills++; p.quests.hunt = (p.quests.hunt || 0) + 1; p.materials.ash += mob.boss ? 5 : 1;
      if (this.matrixNodes(p).some(n => n.type === 'dreno_cosmico')) p.gold += mob.boss ? 10 : 2;
      if (mob.boss) { p.quests.boss = (p.quests.boss || 0) + 1; this.drop(p, 'boss'); }
      else if (Math.random() < 0.18) this.drop(p, 'mob');
    }
  }
  drop(p, origin) {
    if (p.items.length >= 40) { p.gold += 30; return; }
    const generated = Loot.gerarDropEspolio(origin, p.level);
    const isWeapon = /armaPrincipal/.test(generated.tipo || generated.slot || '');
    p.items.push({ id: crypto.randomUUID(), name: generated.nome, type: 'gear', slot: isWeapon ? 'weapon' : 'amulet',
      power: isWeapon ? Math.max(4, p.level * 3 + 4) : 15 + p.level * 5, rarity: generated.raridade, quantity: 1 });
  }
  nextXp(p) { return 100 + p.level * 65; }
  gainXp(p, amount) {
    p.xp += amount;
    while (p.xp >= this.nextXp(p)) { p.xp -= this.nextXp(p); p.level++; p.points++; p.hp = this.stats(p).maxHp; this.effect('level', p, { value: p.level }); }
  }
  gather(p, nodeId) {
    this.assertAlive(p);
    const node = this.room(p).nodes.find(n => n.id === nodeId);
    if (!node || dist(p, node) > 85) fail('Aproxime-se do recurso e pressione E.');
    if (node.readyAt > this.now()) fail('Este recurso ainda está se regenerando.');
    node.readyAt = this.now() + 30000; p.materials[node.type] += 2; p.quests.gather = (p.quests.gather || 0) + 1; this.gainXp(p, 12);
    this.effect('gather', p, { x: node.x, y: node.y }); return { message: `+2 ${catalog.materials[node.type]}` };
  }
  craft(p, recipeId) {
    if (p.zone !== 'noctis') fail('A forja fica na Cidadela de Noctis.');
    const r = catalog.recipes.find(r => r.id === recipeId); if (!r) fail('Receita desconhecida.');
    const price = Math.ceil(r.price * (1 - (p.realm?.buildings.forge || 0) * 0.05 - (this.matrixNodes(p).some(n=>n.type==='alquimia')?0.05:0)));
    if (p.gold < price || Object.entries(r.cost).some(([k, q]) => (p.materials[k] || 0) < q)) fail('Faltam materiais ou moedas para esta receita.');
    if (p.items.length >= 40) fail('Seu inventário está cheio.');
    p.gold -= price; for (const [k, q] of Object.entries(r.cost)) p.materials[k] -= q;
    p.items.push({ id: crypto.randomUUID(), type: r.slot ? 'gear' : 'elixir', name: r.name, quantity: 1, slot: r.slot, power: r.power, rarity: 'Raro' });
    return { message: `${r.name} criado na forja.` };
  }
  use(p, itemId) {
    this.assertAlive(p); const item = p.items.find(i => i.id === itemId); if (!item) fail('Item indisponível.');
    if (item.type === 'elixir') {
      if ((p.cooldowns.elixir || 0) > this.now()) fail('Seu elixir recarrega em 8 segundos.');
      p.hp = Math.min(this.stats(p).maxHp, p.hp + 65); p.cooldowns.elixir = this.now() + 8000;
      if (--item.quantity <= 0) p.items = p.items.filter(i => i.id !== itemId);
    } else {
      const old = p.equipment[item.slot]; p.equipment[item.slot] = item; p.items = p.items.filter(i => i.id !== itemId);
      if (old) p.items.push(old); p.hp = Math.min(p.hp, this.stats(p).maxHp);
    }
    return { message: item.type === 'elixir' ? 'Sua carne foi restaurada.' : `${item.name} equipado.` };
  }
  talent(p, id) {
    const t = catalog.talents.find(t => t.id === id); if (!t || p.points < 1 || (p.talents[id] || 0) >= t.max) fail('Não há pontos disponíveis para este grau.');
    p.points--; p.talents[id] = (p.talents[id] || 0) + 1; return { message: `${t.name} despertou.` };
  }
  claim(p, id) {
    const q = catalog.quests.find(q => q.id === id);
    if (!q || p.claimed.includes(id) || (p.quests[id] || 0) < q.goal) fail('Este contrato ainda não pode ser concluído.');
    p.claimed.push(id); p.gold += q.gold; this.gainXp(p, q.xp); return { message: `Contrato cumprido: +${q.xp} XP e +${q.gold} moedas.` };
  }
  beginRitual(p, id) {
    if (p.zone !== 'altar') fail('Viaje até o Altar do Primeiro Sangue.');
    if (!catalog.pacts.some(x => x.id === id)) fail('Pacto desconhecido.');
    if (p.gold < 30 || p.essence < 25) fail('O ritual exige 30 moedas e 25 essência.');
    if ((p.cooldowns.ritual || 0) > this.now()) fail('Seu círculo precisa de um minuto para se recompor.');
    const seq = Array.from({ length: 5 }, () => crypto.randomInt(0, 4));
    const challenge = { id: crypto.randomUUID(), pact: id, sequence: seq, ready: this.now() + 3500, expires: this.now() + 25000 };
    this.challenges.set(p.id, challenge); return challenge;
  }
  finishRitual(p, data) {
    const c = this.challenges.get(p.id); if (!c || c.id !== data.id || p.zone !== 'altar') fail('Círculo inválido. Inicie o ritual novamente.');
    if (this.now() < c.ready) fail('Observe os sigilos antes de selar o círculo.');
    this.challenges.delete(p.id);
    if (c.expires < this.now() || !Array.isArray(data.sequence) || data.sequence.length !== 5 || data.sequence.some((v, i) => v !== c.sequence[i])) fail('A sequência se rompeu. Tente novamente.');
    if (p.gold < 30 || p.essence < 25) fail('Oferenda insuficiente.');
    p.gold -= 30; p.essence -= 25; p.cooldowns.ritual = this.now() + 60000;
    const pact = catalog.pacts.find(x => x.id === c.pact); const decoded = Lexicon.DecodificarChaveEnochiana(pact.key);
    p.pact = { id: pact.id, name: pact.name, until: this.now() + 600000, word: decoded.palavra };
    p.quests.ritual = (p.quests.ritual || 0) + 1; this.gainXp(p, 45); this.effect('ritual', p);
    return { message: `${pact.name} selado. ${pact.benefit}.` };
  }
  formula(p, nodes) {
    if (!Array.isArray(nodes) || nodes.length < 1 || nodes.length > 3) fail('Combine de um a três sigilos.');
    const operators = { flame: 'RESONANCIA_COSMICA()', shield: 'CANALIZAR_EGREGORA()', shadow: 'DOBRA_ASTRAL()' };
    if (nodes.some(n => !operators[n])) fail('Sigilo desconhecido.');
    const code = nodes.map(n => operators[n]).join('\n'); const parsed = magic.validarFormula(code);
    if (!parsed.valida) fail(parsed.erro);
    if ((p.cooldowns.formula || 0) > this.now()) fail('A fórmula ainda está recarregando.');
    if (p.essence < 20 * nodes.length) fail('Essência insuficiente para esta combinação.');
    this.assertAlive(p); p.essence -= nodes.length * 20; p.cooldowns.formula = this.now() + 12000;
    for (const n of nodes) {
      if (n === 'shield') { p.wardUntil = this.now() + 5000; p.hp = Math.min(this.stats(p).maxHp, p.hp + 20); }
      if (n === 'shadow') { p.invulnerableUntil = this.now() + 1800; this.effect('dash', p, { face: p.face }); }
      if (n === 'flame') for (const mob of this.room(p).mobs) if (mob.hp > 0 && dist(p, mob) < 220) {
        const damage = 30 + this.stats(p).damage; mob.hp = Math.max(0, mob.hp - damage); mob.contributions[p.id] = (mob.contributions[p.id] || 0) + damage;
        this.effect('damage', p, { x: mob.x, y: mob.y, value: damage }); if (!mob.hp) this.killMob(mob, p);
      }
    }
    this.effect('ritual', p); return { message: 'A fórmula atravessou o véu.', code };
  }
  guild(p, action, name) {
    if (action === 'leave') { const g = this.guilds[p.guild]; if (g) { g.members = g.members.filter(id => id !== p.id); if (g.roles) delete g.roles[p.id]; if (g.leader === p.id && g.members.length) { g.leader = g.members[0]; g.roles ||= {}; g.roles[g.leader] = 'hierofante'; } for (const n of g.matrix || []) n.members = n.members.filter(id => id !== p.id); } p.guild = null; return {}; }
    if (p.guild) fail('Você já pertence a uma ordem.');
    if (action === 'create') {
      name = String(name || '').trim(); if (!/^[\p{L}\p{N} '-]{3,28}$/u.test(name)) fail('Use de 3 a 28 caracteres no nome da ordem.');
      if (p.gold < 100) fail('Fundar uma ordem exige 100 moedas.');
      if (Object.values(this.guilds).some(g => g.name.toLowerCase() === name.toLowerCase())) fail('Uma ordem já carrega este nome.');
      const id = crypto.randomUUID(); p.gold -= 100; this.guilds[id] = { id, name, species: p.species, members: [p.id], leader: p.id, treasury: 0, power: 0 }; p.guild = id;
    } else if (action === 'join') {
      const g = this.guilds[name]; if (!g) fail('Escolha uma ordem existente.'); g.members.push(p.id); p.guild = g.id;
    } else fail('Ação desconhecida.');
    return { message: 'Seu sangue agora pertence à ordem.' };
  }
  donate(p) {
    const g = this.guilds[p.guild]; if (!g || p.gold < 25) fail('A egrégora exige uma ordem e 25 moedas.');
    p.gold -= 25; g.treasury += 25; g.power++; this.gainXp(p, 10); return { message: 'A egrégora da sua ordem cresceu.' };
  }
  party(p, action, target) {
    if (action === 'leave') { this.leaveParty(p); return {}; }
    if (action === 'create') {
      if (p.party) fail('Você já está em um grupo.');
      const id = crypto.randomBytes(4).toString('hex'); this.parties[id] = { id, leader: p.id, members: [p.id] }; p.party = id; return { message: `Grupo formado. Código: ${id}` };
    }
    if (action === 'join') {
      const party = this.parties[String(target || '').trim().toLowerCase()]; if (!party || party.members.length >= 4 || p.party) fail('Grupo indisponível, cheio ou você já está em um grupo.');
      party.members.push(p.id); p.party = party.id; return { message: 'Você entrou na expedição.' };
    }
    fail('Ação desconhecida.');
  }
  leaveParty(p) {
    const party = this.parties[p.party]; if (party) { party.members = party.members.filter(id => id !== p.id); if (!party.members.length) delete this.parties[party.id]; else if (party.leader === p.id) party.leader = party.members[0]; }
    p.party = null; if (p.zone.startsWith('crypt')) { p.zone = 'noctis'; p.x = 700; p.y = 540; }
  }
  listing(p, data) {
    if (p.zone !== 'noctis') fail('O mercado fica na cidadela.');
    const item = p.items.find(i => i.id === data.item); const price = Number(data.price);
    if (!item || !Number.isSafeInteger(price) || price < 1 || price > 100000) fail('Selecione um item e um preço de 1 a 100000.');
    if (this.market.filter(x => x.seller === p.id).length >= 10) fail('Você pode manter até 10 ofertas.');
    p.items = p.items.filter(i => i !== item); this.market.push({ id: crypto.randomUUID(), seller: p.id, name: p.name, item, price }); return { message: 'Relíquia colocada no mercado.' };
  }
  buy(p, id) {
    if (p.zone !== 'noctis') fail('Volte à cidadela para negociar.');
    const offer = this.market.find(x => x.id === id); if (!offer) fail('A oferta não está mais disponível.');
    if (p.items.length >= 40) fail('Inventário cheio.');
    if (offer.seller === p.id) { p.items.push(offer.item); this.market = this.market.filter(x => x.id !== id); return { message: 'Oferta retirada.' }; }
    if (p.gold < offer.price) fail('Moedas insuficientes.');
    p.gold -= offer.price; this.players[offer.seller].gold += offer.price; p.items.push(offer.item); this.market = this.market.filter(x => x.id !== id); return { message: 'Relíquia adquirida.' };
  }
  message(p, text) {
    text = String(text || '').trim(); if (!text || text.length > 240) fail('Escreva uma mensagem de até 240 caracteres.');
    if (p.lastChat && this.now() - p.lastChat < 1200) fail('Aguarde um instante entre mensagens.');
    p.lastChat = this.now(); const msg = { id: crypto.randomUUID(), name: p.name, species: p.species, text, at: this.now() };
    this.chat.push(msg); if (this.chat.length > 60) this.chat.shift(); return msg;
  }
  moon() {
    const position = this.now() % 1800000, full = position >= 1200000;
    return { full, name: full ? 'Lua de sangue' : position < 600000 ? 'Lua crescente' : 'Lua gibosa', remaining: full ? 1800000 - position : 1200000 - position, cycle: 1800000 };
  }
  activePlayers(zone) { return [...this.online.keys()].map(id => this.players[id]).filter(p => p && (!zone || p.zone === zone)); }
  tick() {
    const now = this.now(), dt = clamp((now - this.lastTick) / 1000, 0, 0.15); this.lastTick = now;
    for (const p of this.activePlayers()) {
      if (p.deadUntil) {
        if (p.deadUntil <= now) { p.deadUntil = 0; p.zone = 'noctis'; p.x = 700; p.y = 540; p.hp = this.stats(p).maxHp; p.essence = this.stats(p).maxEssence; }
        else continue;
      }
      const input = this.inputs.get(p.id) || { x: 0, y: 0 }; const speed = p.species === 'lycan' ? 220 : 205;
      p.x = clamp(p.x + input.x * speed * dt, 45, WIDTH - 45); p.y = clamp(p.y + input.y * speed * dt, 70, HEIGHT - 45);
      p.essence = Math.min(this.stats(p).maxEssence, p.essence + dt * 6);
      if (this.platform?.cauldron?.until > now) p.hp = Math.min(this.stats(p).maxHp,p.hp+dt*2);
      if (this.matrixNodes(p).some(n=>n.type==='cura_egregora')) p.hp = Math.min(this.stats(p).maxHp,p.hp+dt*1.5);
      if (catalog.zones.find(z => z.id === p.zone)?.safe) p.hp = Math.min(this.stats(p).maxHp, p.hp + dt * (8 + (p.realm?.buildings.font || 0) * 2));
    }
    for (const room of Object.values(this.rooms)) {
      const players = this.activePlayers(room.id).filter(p => !p.deadUntil);
      for (const mob of room.mobs) {
        if (!mob.hp) { if (mob.respawnAt < now) { Object.assign(mob, { hp: mob.maxHp, x: mob.home.x, y: mob.home.y, posture: 100, contributions: {} }); } continue; }
        if (mob.staggerUntil > now) continue;
        if (mob.attackAt) {
          if (mob.attackAt <= now) { for (const p of players) if (dist(p, mob.target) < mob.radius) this.hurt(p, mob.boss ? 45 : 18); this.effect('impact', { ...mob.target, zone: room.id }, { radius: mob.radius }); mob.attackAt = 0; mob.cooldown = now + (mob.boss ? 1800 : 2400); }
          continue;
        }
        const target = players.reduce((closest, p) => dist(p, mob) < (closest ? dist(closest, mob) : mob.boss ? 500 : 280) ? p : closest, null);
        if (!target) continue;
        if (dist(mob, target) < (mob.boss ? 190 : 90) && mob.cooldown < now) {
          mob.target = { x: target.x, y: target.y }; mob.radius = mob.boss ? 125 : 72; mob.attackAt = now + (mob.boss ? 1200 : 900);
        } else if (dist(mob, target) > 60) {
          const a = Math.atan2(target.y - mob.y, target.x - mob.x); const speed = mob.boss ? 68 : 88;
          mob.x += Math.cos(a) * speed * dt; mob.y += Math.sin(a) * speed * dt;
        }
      }
    }
    const cycle = Math.floor(now / 1800000);
    if (this.war.cycle !== cycle) { this.war.winner = this.war.vampire === this.war.lycan ? null : this.war.vampire > this.war.lycan ? 'vampire' : 'lycan'; this.war.cycle = cycle; this.war.vampire = 0; this.war.lycan = 0; this.war.control = 0; this.war.owner = null; }
    if (this.moon().full && now - this.war.lastCapture >= 2000) {
      this.war.lastCapture = now;
      const inCircle = this.activePlayers('war').filter(p => !p.deadUntil && dist(p, { x: 700, y: 360 }) < 145);
      const v = inCircle.filter(p => p.species === 'vampire').length, l = inCircle.length - v;
      if (v !== l) {
        this.war.control = clamp(this.war.control + Math.sign(v - l) * 10, -100, 100);
        for (const p of inCircle) if ((v > l) === (p.species === 'vampire')) { p.quests.war = (p.quests.war || 0) + 1; this.gainXp(p, 2); }
      }
      this.war.owner = this.war.control >= 100 ? 'vampire' : this.war.control <= -100 ? 'lycan' : null;
      if (this.war.owner && inCircle.some(p => p.species === this.war.owner)) this.war[this.war.owner] += 5;
    }
    this.effects = this.effects.filter(e => now - e.at < 1000);
    // Retire empty dungeon instances and stale, disconnected parties without affecting shared rooms.
    for (const id of Object.keys(this.rooms)) if (id.startsWith('crypt:') && !Object.values(this.players).some(p => p.zone === id && this.online.has(p.id))) delete this.rooms[id];
  }
  snapshot(p) {
    const room = this.room(p); return { time: this.now(), width: WIDTH, height: HEIGHT, zone: p.zone, players: this.activePlayers(p.zone).map(x => this.publicPlayer(x)),
      mobs: room.mobs.map(({ contributions, home, ...m }) => m), nodes: room.nodes, effects: this.effects.filter(e => e.zone === p.zone), war: this.war, moon: this.moon() };
  }
  community() {
    return { online: this.online.size, guilds: Object.values(this.guilds).map(g => ({ ...g, members: g.members.map(id => ({ id, name: this.players[id]?.name })) })),
      leaderboard: Object.values(this.players).sort((a, b) => b.level - a.level || b.kills - a.kills).slice(0, 15).map(p => ({ name: p.name, species: p.species, level: p.level, kills: p.kills, pvpKills: p.pvpKills })), market: this.market, moon: this.moon(), war: this.war };
  }
}
module.exports = { World, WIDTH, HEIGHT };
