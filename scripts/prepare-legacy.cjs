'use strict';
const fs=require('node:fs');
const file=new URL('../server.js',`file://${__filename.replace(/\\/g,'/')}`);
let source=fs.readFileSync(file,'utf8');
source=source.replace(/const MONGO_URI = process\.env\.MONGO_URI \|\| [^;]+;/,'const MONGO_URI = process.env.MONGO_URI || "";');
source=source.replace('app.use(express.static(__dirname));','app.use(express.static(__dirname, { index: false }));');
source=source.replace("app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));","app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'legacy/index.html')));");
fs.writeFileSync(file,source);
console.log('Entrada anterior preservada e configuração de banco mantida no ambiente.');
