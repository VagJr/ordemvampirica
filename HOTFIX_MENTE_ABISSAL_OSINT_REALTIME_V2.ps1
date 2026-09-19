# HOTFIX_MENTE_ABISSAL_OSINT_REALTIME_V2.ps1
# V2: localiza a rota /api/nosferatu/rasgar_veu por estrutura,
# sem depender de comentarios/accentos exatos.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host " ORDEM VAMPIRICA - HOTFIX MENTE ABISSAL / OSINT V2" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host ""

$Root = (Get-Location).Path
$ServerPath = Join-Path $Root "server.js"

if (-not (Test-Path $ServerPath)) {
    throw "server.js nao encontrado em: $Root"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)

$routeNeedle = "app.post('/api/nosferatu/rasgar_veu'"
$routeStart = $content.IndexOf($routeNeedle)

if ($routeStart -lt 0) {
    throw "Nao encontrei a rota /api/nosferatu/rasgar_veu no server.js. Nenhum arquivo foi alterado."
}

# Limita a busca ao bloco desta rota ate a proxima rota app.post/app.get.
$nextPost = $content.IndexOf("app.post(", $routeStart + $routeNeedle.Length)
$nextGet  = $content.IndexOf("app.get(",  $routeStart + $routeNeedle.Length)

$candidates = @()
if ($nextPost -gt $routeStart) { $candidates += $nextPost }
if ($nextGet  -gt $routeStart) { $candidates += $nextGet }

if ($candidates.Count -gt 0) {
    $routeEnd = ($candidates | Measure-Object -Minimum).Minimum
} else {
    $routeEnd = $content.Length
}

$routeText = $content.Substring($routeStart, $routeEnd - $routeStart)

Write-Host "[DIAG] Rota Nosferatu encontrada." -ForegroundColor Cyan

# Ja aplicado?
if ($routeText.Contains("'groq/compound'") -and
    $routeText.Contains("'web_search'") -and
    $routeText.Contains("'visit_website'")) {
    Write-Host "[OK] O hotfix V2 ja parece aplicado nesta rota. Nenhuma alteracao necessaria." -ForegroundColor Green
    exit 0
}

# Localiza inicio do bloco IA de forma tolerante.
$analysisCandidates = @(
    $routeText.IndexOf("let analiseIA"),
    $routeText.IndexOf("const groqKey = process.env.GROQ_API_KEY"),
    $routeText.IndexOf("process.env.GROQ_API_KEY")
) | Where-Object { $_ -ge 0 }

if ($analysisCandidates.Count -eq 0) {
    Write-Host ""
    Write-Host "Trecho da rota encontrado, mas o bloco de IA tem estrutura diferente." -ForegroundColor Yellow
    Write-Host "Linhas relevantes:" -ForegroundColor Yellow

    $lines = $routeText -split "`r?`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "Groq|GROQ|analiseIA|model:|Mente Abissal|corAlma") {
            Write-Host ("{0,4}: {1}" -f ($i + 1), $lines[$i])
        }
    }

    throw "Nao consegui identificar com seguranca o inicio do bloco IA. Nenhum arquivo foi alterado."
}

$analysisStartRel = ($analysisCandidates | Measure-Object -Minimum).Minimum

# O ponto final mais seguro e a declaracao let corAlma.
$colorStartRel = $routeText.IndexOf("let corAlma", $analysisStartRel)

if ($colorStartRel -lt 0) {
    throw "Encontrei o bloco IA, mas nao encontrei 'let corAlma' depois dele. Nenhum arquivo foi alterado."
}

$absoluteStart = $routeStart + $analysisStartRel
$absoluteEnd   = $routeStart + $colorStartRel

if ($absoluteEnd -le $absoluteStart) {
    throw "Intervalo de substituicao invalido. Nenhum arquivo foi alterado."
}

$oldBlock = $content.Substring($absoluteStart, $absoluteEnd - $absoluteStart)

Write-Host "[DIAG] Bloco IA atual identificado com $($oldBlock.Length) caracteres." -ForegroundColor Cyan

$replacement = @'
const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) {
            console.error('[NOSFERATU] GROQ_API_KEY ausente no ambiente.');
            return res.status(503).json({
                erro: 'A Mente Abissal está sem ligação ao Oráculo (GROQ_API_KEY ausente).'
            });
        }

        let analiseIA = '';
        try {
            const identidadePublica = [
                nomeReal ? `Nome informado: ${nomeReal}` : null,
                instagram ? `Instagram informado: ${instagram}` : null,
                twitter ? `Twitter/X informado: ${twitter}` : null,
                urlPerfil ? `URL de perfil informada: ${urlPerfil}` : null,
                notas ? `Notas do operador: ${notas}` : null
            ].filter(Boolean).join('\n');

            const promptOSINT = `
TU ÉS A MENTE ABISSAL do jogo ORDEM VAMPÍRICA. Esta tarefa exige PESQUISA PÚBLICA REAL E VERIFICÁVEL.

ALVO INFORMADO:
${identidadePublica}

DADOS RITUAIS DO JOGO — são ficção narrativa, não evidência factual:
- Peso de Gematria: ${gematria}
- Essência ritual: ${julgamento.essencia}
- Corrupção ritual: ${julgamento.taxaCorrupcao}%

REGRAS:
1. Usa pesquisa web em tempo real antes de responder.
2. Se houver URL pública, visita-a quando tecnicamente acessível.
3. Não mistures homónimos. Se não for possível confirmar a identidade, diz isso explicitamente.
4. Usa somente informação pública e verificável.
5. Não inventes, não faças cold reading como se fosse facto e não alegues ter hackeado nada.
6. Não exponhas morada, telefone, e-mail privado, documentos ou localização precisa.
7. Não infiras atributos sensíveis como saúde, religião, orientação sexual, etnia, política, finanças ou diagnósticos psicológicos.
8. Qualidades e limitações só podem ser descritas quando houver evidências públicas concretas.
9. Mantém o tom vampírico somente na camada "LEITURA DO VÉU".
10. Termina com FONTES CONSULTADAS contendo as principais URLs realmente usadas.

FORMATO:
IDENTIDADE VERIFICADA
PRESENÇA DIGITAL PÚBLICA
ATIVIDADES / TRAJETÓRIA
QUALIDADES OBSERVÁVEIS
LIMITAÇÕES / PONTOS DE ATENÇÃO OBSERVÁVEIS
LEITURA DO VÉU — NARRATIVA DO JOGO
GRAU DE CONFIANÇA DA IDENTIFICAÇÃO
FONTES CONSULTADAS
`;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000);

            let groqRes;
            try {
                groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${groqKey}`,
                        'Content-Type': 'application/json',
                        'Groq-Model-Version': 'latest'
                    },
                    body: JSON.stringify({
                        model: process.env.GROQ_OSINT_MODEL || 'groq/compound',
                        messages: [
                            {
                                role: 'system',
                                content: 'És um investigador OSINT com estética vampírica. Nunca transformes inferência em facto. Pesquisa antes de responder e cita fontes públicas.'
                            },
                            { role: 'user', content: promptOSINT }
                        ],
                        citation_options: 'enabled',
                        compound_custom: {
                            tools: {
                                enabled_tools: ['web_search', 'visit_website']
                            }
                        },
                        max_completion_tokens: 1800
                    }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeout);
            }

            const rawGroq = await groqRes.text();

            let groqData = {};
            try {
                groqData = rawGroq ? JSON.parse(rawGroq) : {};
            } catch (_) {
                groqData = {};
            }

            if (!groqRes.ok) {
                const detalhe = groqData?.error?.message || rawGroq || `HTTP ${groqRes.status}`;
                console.error(`[NOSFERATU] Groq HTTP ${groqRes.status}:`, detalhe);

                return res.status(502).json({
                    erro: `A Mente Abissal alcançou o Oráculo, mas a varredura externa falhou (Groq HTTP ${groqRes.status}).`,
                    detalhe: String(detalhe).slice(0, 350)
                });
            }

            const mensagemGroq = groqData?.choices?.[0]?.message;
            analiseIA = mensagemGroq?.content?.trim() || '';

            const ferramentas = Array.isArray(mensagemGroq?.executed_tools)
                ? mensagemGroq.executed_tools
                : [];

            if (!analiseIA) {
                console.error(
                    '[NOSFERATU] Groq respondeu sem conteúdo.',
                    JSON.stringify(groqData).slice(0, 1200)
                );

                return res.status(502).json({
                    erro: 'A Mente Abissal contactou as dimensões exteriores, mas voltou sem qualquer leitura.'
                });
            }

            if (ferramentas.length === 0) {
                console.warn(
                    '[NOSFERATU] Resposta sem executed_tools. Dossiê rejeitado para evitar análise não fundamentada.'
                );

                return res.status(502).json({
                    erro: 'A Mente Abissal respondeu, mas não executou a varredura web exigida. O dossiê não foi gravado.'
                });
            }

            console.log(
                `[NOSFERATU] Varredura real concluída. Ferramentas externas usadas: ${ferramentas.length}.`
            );

        } catch (e) {
            const expirou = e?.name === 'AbortError';

            console.error('[NOSFERATU] Falha na varredura Groq Compound:', e);

            return res.status(expirou ? 504 : 502).json({
                erro: expirou
                    ? 'A varredura da Mente Abissal excedeu 60 segundos.'
                    : 'A Mente Abissal não conseguiu concluir a pesquisa externa.',
                detalhe: e?.message || 'Erro desconhecido'
            });
        }


'@

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backup = "$ServerPath.bak_mente_abissal_v2_$timestamp"

Copy-Item $ServerPath $backup -Force
Write-Host "[1/5] Backup criado:" -ForegroundColor Cyan
Write-Host "      $backup"

$newContent =
    $content.Substring(0, $absoluteStart) +
    $replacement +
    $content.Substring($absoluteEnd)

[System.IO.File]::WriteAllText($ServerPath, $newContent, $utf8NoBom)

Write-Host "[2/5] Bloco Nosferatu substituido." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Copy-Item $backup $ServerPath -Force
    throw "Node.js nao encontrado. Backup restaurado."
}

Write-Host "[3/5] Validando sintaxe..." -ForegroundColor Cyan
& node --check $ServerPath

if ($LASTEXITCODE -ne 0) {
    Copy-Item $backup $ServerPath -Force
    throw "node --check falhou. Backup restaurado automaticamente."
}

$final = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)

$routeStart2 = $final.IndexOf($routeNeedle)
$nextPost2 = $final.IndexOf("app.post(", $routeStart2 + $routeNeedle.Length)
$nextGet2  = $final.IndexOf("app.get(",  $routeStart2 + $routeNeedle.Length)

$candidates2 = @()
if ($nextPost2 -gt $routeStart2) { $candidates2 += $nextPost2 }
if ($nextGet2  -gt $routeStart2) { $candidates2 += $nextGet2 }

if ($candidates2.Count -gt 0) {
    $routeEnd2 = ($candidates2 | Measure-Object -Minimum).Minimum
} else {
    $routeEnd2 = $final.Length
}

$routeText2 = $final.Substring($routeStart2, $routeEnd2 - $routeStart2)

$checks = @(
    @{ Nome = "groq/compound"; Ok = $routeText2.Contains("'groq/compound'") },
    @{ Nome = "web_search"; Ok = $routeText2.Contains("'web_search'") },
    @{ Nome = "visit_website"; Ok = $routeText2.Contains("'visit_website'") },
    @{ Nome = "citation_options"; Ok = $routeText2.Contains("citation_options: 'enabled'") },
    @{ Nome = "AbortController"; Ok = $routeText2.Contains("new AbortController()") },
    @{ Nome = "executed_tools"; Ok = $routeText2.Contains("executed_tools") },
    @{ Nome = "modelo antigo removido DA ROTA"; Ok = -not ($routeText2 -match "llama-3\.3-70b-versatile") }
)

Write-Host "[4/5] Verificando hotfix..." -ForegroundColor Cyan

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
    Copy-Item $backup $ServerPath -Force
    throw "Verificacao final falhou. Backup restaurado."
}

Write-Host "[5/5] HOTFIX V2 APLICADO COM SUCESSO." -ForegroundColor Green
Write-Host ""
Write-Host "Proximos comandos:" -ForegroundColor Yellow
Write-Host "  fly secrets list -a ordem"
Write-Host "  git diff -- server.js"
Write-Host ""
Write-Host "NAO faca deploy antes de verificar se GROQ_API_KEY aparece na lista de secrets." -ForegroundColor Yellow
