'use strict';
const express = require('express');
const http = require('node:http');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { Server } = require('socket.io');
const { World } = require('./game/world');
const catalog = require('./game/catalog');
const { Platform } = require('./game/platform');
const scrypt = promisify(crypto.scrypt);
const cookieToken = req => (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('sanguinis='))?.slice(10) || '';

function createServer(options = {}) {
  const app = express(), server = http.createServer(app);
  const world = options.world || new World();
  const platform = new Platform(world);
  const io = new Server(server, { maxHttpBufferSize: 16384, cors: false });
  const limits = new Map();
  app.disable('x-powered-by'); app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:; font-src 'self'; frame-ancestors 'self'");
    if (req.path.startsWith('/api')) res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'POST' && req.headers.origin && req.headers.origin !== `${req.protocol}://${req.get('host')}`) return res.status(403).json({ error: 'Origem não autorizada.' });
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  const setCookie = (req, res, token) => res.setHeader('Set-Cookie', `sanguinis=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000${req.secure ? '; Secure' : ''}`);
  const auth = (req, res, next) => { req.player = world.authenticate(cookieToken(req)); if (!req.player) return res.status(401).json({ error: 'Entre no mundo para continuar.' }); next(); };
  const rate = (req, res, next) => {
    const key = req.ip, now = Date.now(), entry = limits.get(key) || { at: now, count: 0 };
    if (now - entry.at > 60000) { entry.at = now; entry.count = 0; }
    entry.count++; limits.set(key, entry);
    if (entry.count > 20) return res.status(429).json({ error: 'Muitas tentativas. Aguarde um minuto.' }); next();
  };
  const route = fn => async (req, res, next) => { try { await fn(req, res); } catch (err) { next(err); } };
  app.get('/api/health', (req, res) => res.json({ ok: true, version: 'Sanguinis 2.0', online: world.online.size }));
  app.get('/api/catalog', (req, res) => res.json(catalog));
  app.get('/api/community', (req, res) => res.json(world.community()));
  app.get('/api/platform', (req, res) => res.json(platform.view(world.authenticate(cookieToken(req)))));
  app.get('/api/export', auth, (req, res) => {
    const p = req.player; res.setHeader('Content-Disposition', 'attachment; filename="sanguinis-meus-estudos.json"');
    res.json({ player: world.privatePlayer(p), studies: platform.view(p).library.filter(t => t.owner === p.id), journals: platform.view(p).journals.filter(j => j.owner === p.id), records: platform.view(p).records, exported: new Date().toISOString() });
  });
  app.get('/api/session', (req, res) => { const p = world.authenticate(cookieToken(req)); res.json({ player: p ? world.privatePlayer(p) : null, party: p?.party ? world.parties[p.party] : null }); });
  app.post('/api/auth/guest', rate, route(async (req, res) => {
    const existing = world.authenticate(cookieToken(req)); if (existing) return res.json({ player: world.privatePlayer(existing) });
    const p = world.createPlayer(req.body.name, req.body.species); p.guest = true; platform.init(p);
    const token = world.session(p.id); world.save(); setCookie(req, res, token); res.json({ player: world.privatePlayer(p) });
  }));
  app.post('/api/auth/register', rate, route(async (req, res) => {
    const username = String(req.body.username || '').trim().toLowerCase(), password = String(req.body.password || '');
    if (!/^[a-z0-9_]{3,24}$/.test(username) || password.length < 8 || password.length > 128) throw new Error('Use um login de 3 a 24 caracteres e uma senha de 8 a 128 caracteres.');
    if (world.accounts[username]) throw new Error('Este login já existe.');
    const salt = crypto.randomBytes(16).toString('hex'), hash = (await scrypt(password, salt, 64)).toString('hex');
    const existing = world.authenticate(cookieToken(req));
    if (existing && !existing.guest) throw new Error('Este personagem já possui uma conta.');
    if (world.accounts[username]) throw new Error('Este login já existe.');
    const p = existing || world.createPlayer(req.body.name, req.body.species); p.guest = false; platform.init(p);
    world.accounts[username] = { id: p.id, salt, hash }; const token = world.session(p.id); world.save(); setCookie(req, res, token);
    res.json({ player: world.privatePlayer(p) });
  }));
  app.post('/api/auth/login', rate, route(async (req, res) => {
    const a = world.accounts[String(req.body.username || '').trim().toLowerCase()], password = String(req.body.password || '');
    if (password.length > 128) throw new Error('Login ou senha inválidos.');
    const hash = await scrypt(password, a?.salt || 'dummy-auth-salt', 64);
    if (!a || !crypto.timingSafeEqual(hash, Buffer.from(a.hash, 'hex'))) throw new Error('Login ou senha inválidos.');
    const p = world.players[a.id], token = world.session(p.id); world.save(); setCookie(req, res, token); res.json({ player: world.privatePlayer(p) });
  }));
  app.post('/api/auth/logout', auth, route(async (req, res) => {
    const id = req.player.id; delete world.sessions[cookieToken(req)]; const sid = world.online.get(id); if (sid) io.sockets.sockets.get(sid)?.disconnect(true);
    world.save(); res.setHeader('Set-Cookie', 'sanguinis=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); res.json({ ok: true });
  }));
  app.post('/api/auth/legacy', rate, route(async (req, res) => {
    const p = platform.legacyLogin(req.body.name, req.body.password), token = world.session(p.id);
    world.save(); setCookie(req, res, token); res.json({ player: world.privatePlayer(p) });
  }));
  const platformActions = new Set(['journal','journalShare','study','aiStudy','publish','tomeShare','comment','peerReview','deepenStudy','crystallize','orderProfile','office','decree','event','rsvp','gradeRequest','gradeReview','temple','matrix','attune','collectiveRite','riteJoin','bank','transfer','bondInvite','bondAccept','bondEnd','transfusion','tradeOffer','tradeAccept','tradeCancel','cauldron','contractPost','contractAccept','contractComplete','contractCancel','spell','saveFormula','executeFormula','realmBuild','servant','servantCollect','familiar','daily','ouroboros','recordSearch','recordSeal','recordDelete']);
  app.post('/api/action', auth, route(async (req, res) => {
    const p = req.player, { action, data = {} } = req.body; let result;
    const calls = {
      travel: () => world.travel(p, data.zone), craft: () => world.craft(p, data.recipe), use: () => world.use(p, data.item),
      talent: () => world.talent(p, data.id), claim: () => world.claim(p, data.id), ritualBegin: () => world.beginRitual(p, data.pact),
      ritualFinish: () => world.finishRitual(p, data), formula: () => world.formula(p, data.nodes),
      guild: () => world.guild(p, data.action, data.name), donate: () => world.donate(p), party: () => world.party(p, data.action, data.code),
      listing: () => world.listing(p, data), buy: () => world.buy(p, data.id)
    };
    if (!calls[action] && !platformActions.has(action)) throw new Error('Ação desconhecida.');
    const now = world.now(); if (!p.actionWindow || now - p.actionWindow >= 1000) { p.actionWindow = now; p.actionCount = 0; } if (++p.actionCount > 12) throw new Error('Muitas ações em sequência. Aguarde um instante.');
    result = calls[action] ? calls[action]() : await platform.action(p, action, data); world.save();
    if (['guild','orderProfile','office','decree','event','rsvp','gradeRequest','gradeReview','donate','temple','matrix','attune','collectiveRite','riteJoin','publish','tomeShare','comment','peerReview','journalShare','bondInvite','bondAccept','bondEnd','tradeOffer','tradeAccept','tradeCancel','contractPost','contractAccept','contractComplete','cauldron'].includes(action)) socketPlatformChanged(p.id);
    res.json({ ...result, player: world.privatePlayer(p), party: p.party ? world.parties[p.party] : null, community: world.community(), platform: platform.view(p) });
  }));
  function socketPlatformChanged(author) { io.emit('platformChanged', { author }); }
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h', index: false, dotfiles: 'deny' }));
  // Only public assets are served: source files, databases, backups and environment files are never exposed.
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError || err.type === 'entity.too.large') return res.status(400).json({ error: 'Requisição inválida.' });
    res.status(400).json({ error: err.message || 'A noite recusou esta ação.' });
  });
  io.use((socket, next) => { const p = world.authenticate(cookieToken(socket.request)); if (!p) return next(new Error('Sessão inválida.')); socket.data.playerId = p.id; next(); });
  io.on('connection', socket => {
    const id = socket.data.playerId, old = world.online.get(id); if (old) io.sockets.sockets.get(old)?.disconnect(true);
    world.connect(id, socket.id); socket.emit('chatHistory', world.chat);
    let windowAt = Date.now(), count = 0;
    const limited = handler => (...args) => { if (Date.now() - windowAt > 1000) { windowAt = Date.now(); count = 0; } if (++count < 45) handler(...args); };
    socket.on('input', limited(input => world.move(world.players[id], input)));
    socket.on('skill', limited((data = {}, ack) => { try { world.skill(world.players[id], data.id, data.aim); if (typeof ack === 'function') ack({ ok: true }); } catch (e) { if (typeof ack === 'function') ack({ error: e.message }); } }));
    socket.on('gather', limited((data = {}, ack) => { try { const r = world.gather(world.players[id], data.id); if (typeof ack === 'function') ack(r); } catch(e) { if (typeof ack === 'function') ack({ error: e.message }); } }));
    socket.on('chat', limited((data = {}, ack) => { try { const msg = world.message(world.players[id], data.text); io.emit('chat', msg); } catch(e) { if (typeof ack === 'function') ack({ error: e.message }); } }));
    socket.on('disconnect', () => world.disconnect(id, socket.id));
  });
  let frames = 0;
  const tick = setInterval(() => {
    world.tick(); frames++;
    for (const [id, sid] of world.online) {
      const socket = io.sockets.sockets.get(sid), p = world.players[id]; if (!socket) continue;
      socket.emit('world', world.snapshot(p)); if (frames % 5 === 0) socket.emit('player', { player: world.privatePlayer(p), party: p.party ? world.parties[p.party] : null });
    }
    if (frames % 50 === 0) io.emit('community', world.community());
  }, 100);
  const save = setInterval(() => { try { world.save(); } catch(e) { console.error('Falha na persistência:', e.message); } }, 10000);
  const cleanup = setInterval(() => { for (const [k, entry] of limits) if (Date.now() - entry.at > 120000) limits.delete(k); for (const [k, entry] of Object.entries(world.sessions)) if (entry.expires < world.now()) delete world.sessions[k]; }, 60000);
  const close = () => { clearInterval(tick); clearInterval(save); clearInterval(cleanup); world.save(); io.close(); server.close(); };
  return { app, server, io, world, platform, close };
}
if (require.main === module) {
  const instance = createServer(), port = Number(process.env.PORT || 8080);
  instance.server.listen(port, '0.0.0.0', () => console.log(`SANGUINIS · A noite renasce em http://localhost:${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { instance.close(); });
}
module.exports = { createServer };

