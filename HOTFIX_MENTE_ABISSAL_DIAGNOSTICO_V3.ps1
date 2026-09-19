# HOTFIX_MENTE_ABISSAL_DIAGNOSTICO_V3.ps1
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host " ORDEM VAMPIRICA - MENTE ABISSAL DIAGNOSTICO V3" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host ""

$Root = (Get-Location).Path
$ServerPath = Join-Path $Root "server.js"
$IndexPath = Join-Path $Root "index.html"

if (-not (Test-Path $ServerPath)) { throw "server.js nao encontrado em $Root" }
if (-not (Test-Path $IndexPath))  { throw "index.html nao encontrado em $Root" }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$server = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)
$index  = [System.IO.File]::ReadAllText($IndexPath,  [System.Text.Encoding]::UTF8)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$serverBackup = "$ServerPath.bak_nosferatu_v3_$timestamp"
$indexBackup  = "$IndexPath.bak_nosferatu_v3_$timestamp"

Copy-Item $ServerPath $serverBackup -Force
Copy-Item $IndexPath  $indexBackup  -Force

Write-Host "[1/6] Backups criados." -ForegroundColor Cyan

# BACKEND: endpoint seguro de diagnostico do deploy
if (-not $server.Contains("app.get('/api/build-info'")) {
    $anchor = "app.use(express.static(__dirname));"

    if (-not $server.Contains($anchor)) {
        Copy-Item $serverBackup $ServerPath -Force
        Copy-Item $indexBackup $IndexPath -Force
        throw "Ancora do Express nao encontrada. Backups restaurados."
    }

    $buildInfo = @'

app.get('/api/build-info', (req, res) => {
    res.json({
        app: 'ordemvampirica',
        nosferatuVersion: 'REALTIME_OSINT_V3',
        renderCommit: process.env.RENDER_GIT_COMMIT || null,
        renderServiceId: process.env.RENDER_SERVICE_ID || null,
        nodeEnv: process.env.NODE_ENV || null,
        groqConfigured: Boolean(process.env.GROQ_API_KEY),
        groqOsintModel: process.env.GROQ_OSINT_MODEL || 'groq/compound',
        startedAt: global.__ordemStartedAt || null
    });
});

'@

    $server = $server.Replace($anchor, $anchor + $buildInfo)
}

if (-not $server.Contains("global.__ordemStartedAt =")) {
    $server = $server.Replace(
        "const app = express();",
        "const app = express();`r`nglobal.__ordemStartedAt = new Date().toISOString();"
    )
}

# FRONTEND: substitui a funcao inteira para nunca deixar resultado antigo visivel.
$startNeedle = "    async function rasgarVeuNosferatu() {"
$endNeedle   = "    function renderizarAlvosNosferatu() {"

$start = $index.IndexOf($startNeedle)
$end   = $index.IndexOf($endNeedle)

if ($start -lt 0 -or $end -lt 0 -or $end -le $start) {
    Copy-Item $serverBackup $ServerPath -Force
    Copy-Item $indexBackup $IndexPath -Force
    throw "Nao encontrei com seguranca rasgarVeuNosferatu(). Backups restaurados."
}

$newFunction = @'
    async function rasgarVeuNosferatu() {
        if (!meuVampiro || (!meuVampiro.admin && meuVampiro.geracao !== 1 && meuVampiro.nivel < 99)) {
            return ocultoAlert("Heresia. Apenas Mestres Supremos Nv.99 podem rasgar o Véu.");
        }

        const nomeReal = document.getElementById('nosf-nome-real').value.trim();
        const instagram = document.getElementById('nosf-instagram').value.trim();
        const twitter = document.getElementById('nosf-twitter').value.trim();
        const urlPerfil = document.getElementById('nosf-url-perfil').value.trim();
        const notas = document.getElementById('nosf-notas').value.trim();

        if (!nomeReal && !instagram && !twitter && !urlPerfil) {
            return ocultoAlert("O Véu exige ao menos um fragmento de identidade para ser rasgado.");
        }

        const container = document.getElementById('nosf-dossie-conteudo');
        const resultBox = document.getElementById('nosf-resultado');

        // Nunca reaproveitar visualmente um dossie antigo.
        resultBox.style.display = 'block';
        container.innerHTML = `
            <div style="padding:16px; border-left:3px solid var(--magia); background:#08000d;">
                <div style="color:var(--magia);font-family:'Cinzel',serif;font-weight:bold;">
                    👁️ A Mente Abissal está a atravessar o Véu...
                </div>
                <div style="color:#888;margin-top:8px;">
                    Pesquisa pública em tempo real e validação de identidade em andamento.
                </div>
            </div>
        `;

        playSfx('magia');
        showJuiceNotif("VÉU RASGANDO", "A Inteligência Nosferatu está a varrer as dimensões...");

        try {
            const res = await fetch('/api/nosferatu/rasgar_veu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store',
                body: JSON.stringify({
                    adminId: meuVampiro.id,
                    nomeReal, instagram, twitter, urlPerfil, notas
                })
            });

            const raw = await res.text();
            let dados = {};

            try {
                dados = raw ? JSON.parse(raw) : {};
            } catch (_) {
                dados = {
                    erro: `Resposta inválida do servidor (HTTP ${res.status}).`,
                    detalhe: raw.slice(0, 500)
                };
            }

            if (!res.ok || dados.erro) {
                const erro = dados.erro || `Falha HTTP ${res.status}`;
                const detalhe = dados.detalhe ? String(dados.detalhe) : '';

                container.innerHTML = `
                    <div style="padding:14px;background:#160006;border-left:3px solid #ff3344;">
                        <div style="color:#ff6677;font-family:'Cinzel',serif;font-weight:bold;">
                            ⚠️ A VARREDURA FALHOU
                        </div>
                        <div style="color:#ddd;margin-top:8px;white-space:pre-wrap;">${erro}</div>
                        ${detalhe ? `<div style="color:#888;margin-top:8px;font-size:.85em;white-space:pre-wrap;">${detalhe}</div>` : ''}
                        <div style="color:#666;margin-top:10px;font-size:.78em;">
                            HTTP ${res.status}. O dossiê anterior foi descartado desta tela.
                        </div>
                    </div>
                `;

                ocultoAlert(erro);
                console.error("Nosferatu backend error:", res.status, dados);
                return;
            }

            if (!dados.dossie || !dados.dossie.analiseIA) {
                container.innerHTML = `
                    <div style="padding:14px;background:#160006;border-left:3px solid #ff3344;">
                        <div style="color:#ff6677;font-family:'Cinzel',serif;font-weight:bold;">
                            ⚠️ DOSSIÊ INVÁLIDO
                        </div>
                        <div style="color:#ddd;margin-top:8px;">
                            O servidor respondeu, mas não entregou uma análise fundamentada.
                        </div>
                    </div>
                `;
                console.error("Nosferatu invalid payload:", dados);
                return;
            }

            container.innerHTML = `
                <div class="nosf-stat"><span class="nosf-stat-label">Nome Astral</span><span class="nosf-stat-value">${dados.dossie.nomeAstral || nomeReal}</span></div>
                <div class="nosf-stat"><span class="nosf-stat-label">Peso Kármico (Gematria)</span><span class="nosf-stat-value">${dados.dossie.pesoKarmico}</span></div>
                <div class="nosf-stat"><span class="nosf-stat-label">Qualidade da Alma</span><span class="nosf-stat-value" style="color:${dados.dossie.corAlma || '#d080ff'}">${dados.dossie.essencia}</span></div>
                <div class="nosf-stat"><span class="nosf-stat-label">Taxa de Corrupção</span><span class="nosf-stat-value">${dados.dossie.taxaCorrupcao}%</span></div>
                <div class="nosf-stat"><span class="nosf-stat-label">Sigilo Astral</span><span class="nosf-stat-value" style="font-family:monospace;font-size:0.8em;">${dados.dossie.sigilo}</span></div>
                <div class="nosf-stat"><span class="nosf-stat-label">Plataformas Vinculadas</span><span class="nosf-stat-value">${(dados.dossie.plataformas || []).join(', ') || 'Nenhuma'}</span></div>

                <div style="margin-top:15px;padding:12px;background:#0a0015;border-left:3px solid var(--magia);border-radius:3px;">
                    <div style="color:var(--magia);font-weight:bold;margin-bottom:5px;font-family:'Cinzel',serif;">
                        📖 Análise da Mente Abissal
                    </div>
                    <div style="color:#bbb;line-height:1.6;white-space:pre-wrap;">${dados.dossie.analiseIA}</div>
                </div>

                <div style="margin-top:15px;">
                    <div style="color:var(--ouro);font-weight:bold;margin-bottom:8px;font-family:'Cinzel',serif;">
                        ⚡ Ações Kármicas Disponíveis
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'drenar_vitalidade')">🩸 Drenar Vitalidade</button>
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'sussurro_veu')">👁️ Sussurro no Véu</button>
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'maldicao_espelho')">🪞 Maldição do Espelho</button>
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'laco_sangue')">🔗 Laço de Sangue</button>
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'olho_seth')">👁️ Olho de Seth</button>
                        <button class="nosf-action-btn" onclick="executarAcaoKarmica('${dados.dossie.alvoId}', 'sombra_akasha')">🌑 Sombra de Akasha</button>
                    </div>
                </div>
            `;

            document.getElementById('nosf-nome-real').value = '';
            document.getElementById('nosf-instagram').value = '';
            document.getElementById('nosf-twitter').value = '';
            document.getElementById('nosf-url-perfil').value = '';
            document.getElementById('nosf-notas').value = '';

            if (dados.dossie.alvoId) {
                alvosNosferatuCache.push(dados.dossie);
                renderizarAlvosNosferatu();
            }

            sussurroDemonioBrasil(
                `O Véu foi rasgado. A alma de ${nomeReal || 'um mortal'} agora é visível. Peso kármico: ${dados.dossie.pesoKarmico}. Essência: ${dados.dossie.essencia}.`
            );

        } catch(e) {
            container.innerHTML = `
                <div style="padding:14px;background:#160006;border-left:3px solid #ff3344;">
                    <div style="color:#ff6677;font-family:'Cinzel',serif;font-weight:bold;">
                        ⚠️ A FENDA CÓSMICA ROMPEU
                    </div>
                    <div style="color:#ddd;margin-top:8px;">
                        ${e?.message || 'Falha de rede ao contactar o servidor.'}
                    </div>
                    <div style="color:#666;margin-top:10px;font-size:.78em;">
                        O dossiê anterior foi removido desta tela.
                    </div>
                </div>
            `;

            ocultoAlert("A Fenda Cósmica rejeitou a varredura. Consulta o erro mostrado no painel.");
            console.error("Nosferatu Error:", e);
        }
    }

'@

$index = $index.Substring(0, $start) + $newFunction + $index.Substring($end)

[System.IO.File]::WriteAllText($ServerPath, $server, $utf8NoBom)
[System.IO.File]::WriteAllText($IndexPath,  $index,  $utf8NoBom)

Write-Host "[2/6] /api/build-info aplicado." -ForegroundColor Cyan
Write-Host "[3/6] Frontend passa a limpar o dossie anterior e mostrar o erro real." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Copy-Item $serverBackup $ServerPath -Force
    Copy-Item $indexBackup $IndexPath -Force
    throw "Node.js nao encontrado. Backups restaurados."
}

Write-Host "[4/6] Validando server.js..." -ForegroundColor Cyan
& node --check $ServerPath

if ($LASTEXITCODE -ne 0) {
    Copy-Item $serverBackup $ServerPath -Force
    Copy-Item $indexBackup $IndexPath -Force
    throw "server.js falhou no node --check. Backups restaurados."
}

$serverFinal = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)
$indexFinal  = [System.IO.File]::ReadAllText($IndexPath,  [System.Text.Encoding]::UTF8)

$checks = @(
    @{ Nome = "/api/build-info"; Ok = $serverFinal.Contains("app.get('/api/build-info'") },
    @{ Nome = "REALTIME_OSINT_V3"; Ok = $serverFinal.Contains("REALTIME_OSINT_V3") },
    @{ Nome = "groq/compound"; Ok = $serverFinal.Contains("'groq/compound'") },
    @{ Nome = "web_search"; Ok = $serverFinal.Contains("'web_search'") },
    @{ Nome = "frontend no-store"; Ok = $indexFinal.Contains("cache: 'no-store'") },
    @{ Nome = "frontend mostra HTTP"; Ok = $indexFinal.Contains("O dossiê anterior foi descartado desta tela.") }
)

Write-Host "[5/6] Verificacoes:" -ForegroundColor Cyan
$falhas = @()

foreach ($c in $checks) {
    if ($c.Ok) {
        Write-Host ("      [OK] {0}" -f $c.Nome) -ForegroundColor Green
    } else {
        Write-Host ("      [FALHA] {0}" -f $c.Nome) -ForegroundColor Red
        $falhas += $c.Nome
    }
}

if ($falhas.Count -gt 0) {
    Copy-Item $serverBackup $ServerPath -Force
    Copy-Item $indexBackup $IndexPath -Force
    throw "Verificacao V3 falhou. Backups restaurados."
}

Write-Host "[6/6] V3 APLICADA COM SUCESSO." -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos modificados: server.js e index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Depois de publicar no Render, abra:" -ForegroundColor Yellow
Write-Host "  https://SEU-DOMINIO/api/build-info"
Write-Host ""
Write-Host "Esperado: nosferatuVersion=REALTIME_OSINT_V3 e groqConfigured=true" -ForegroundColor Yellow
