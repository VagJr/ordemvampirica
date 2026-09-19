# HOTFIX_MENTE_ABISSAL_OSINT_REALTIME.ps1
# Corrige somente o fluxo /api/nosferatu/rasgar_veu em server.js.
# - remove o modelo Groq descontinuado
# - usa groq/compound
# - habilita web_search + visit_website
# - exige pesquisa externa realmente executada
# - melhora diagnostico de erro
# - impede dossie "real" sem grounding
# - preserva o restante do projeto

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host " ORDEM VAMPIRICA - HOTFIX MENTE ABISSAL / OSINT REALTIME" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host ""

$Root = (Get-Location).Path
$ServerPath = Join-Path $Root "server.js"

if (-not (Test-Path $ServerPath)) {
    throw "server.js nao encontrado em: $Root`nExecute este script na raiz do repositorio ordemvampirica."
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)

if ($content -match "groq/compound" -and $content -match "enabled_tools:\s*\['web_search',\s*'visit_website'\]") {
    Write-Host "[OK] O hotfix parece ja estar aplicado. Nenhuma alteracao feita." -ForegroundColor Green
    exit 0
}

$pattern = '(?s)\r?\n\r?\n\s*// Gerar Análise de IA via Groq.*?\r?\n\s*// Determinar cor da alma'
$matches = [regex]::Matches($content, $pattern)

if ($matches.Count -ne 1) {
    throw "Esperava encontrar exatamente 1 bloco antigo da Analise Groq, mas encontrei $($matches.Count). Nenhum arquivo foi alterado."
}

$replacement = @'
        // Gerar Análise de IA via Groq Compound + WEB SEARCH REAL
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
TU ÉS A MENTE ABISSAL do jogo ORDEM VAMPÍRICA, mas esta tarefa exige PESQUISA PÚBLICA REAL E VERIFICÁVEL.

ALVO INFORMADO:
${identidadePublica}

DADOS RITUAIS DO JOGO (são apenas ficção/narrativa, nunca prova factual):
- Peso de Gematria: ${gematria}
- Essência ritual: ${julgamento.essencia}
- Corrupção ritual: ${julgamento.taxaCorrupcao}%

MISSÃO OBRIGATÓRIA:
1. Antes de responder, usa pesquisa web em tempo real. Se houver URL pública informada, visita-a quando tecnicamente acessível.
2. Faz correspondência de identidade com cautela. NÃO mistures homónimos/nomes semelhantes. Se não houver evidência suficiente para confirmar a identidade, declara explicitamente a incerteza.
3. Usa apenas informação PUBLICAMENTE DISPONÍVEL e verificável. Não exponhas morada, telefone, e-mail privado, documentos, localização precisa ou outros dados pessoais privados.
4. Não inventes, não faças "cold reading" como se fosse facto e não alegues ter hackeado nada.
5. Não infiras saúde, religião, orientação sexual, etnia, opiniões políticas, situação financeira, diagnóstico psicológico ou outros atributos sensíveis.
6. Qualidades e limitações só podem ser descritas quando houver sinais públicos concretos (trabalho publicado, projetos, entrevistas, posts públicos, resultados documentados). Explica a evidência e usa linguagem probabilística quando necessário.
7. Se o alvo for uma pessoa privada com pouca presença pública, limita o dossiê ao que foi encontrado e diz claramente que os dados são insuficientes para uma avaliação pessoal completa.
8. Mantém o TOM sombrio/vampírico apenas na camada narrativa. Separa sempre FACTOS VERIFICADOS de LEITURA DO VÉU (ficção do jogo).
9. Inclui fontes no próprio texto e termina com "FONTES CONSULTADAS", listando título e URL das principais fontes realmente usadas.

FORMATO DA RESPOSTA:
IDENTIDADE VERIFICADA
PRESENÇA DIGITAL PÚBLICA
ATIVIDADES / TRAJETÓRIA
QUALIDADES OBSERVÁVEIS (com evidências)
LIMITAÇÕES / PONTOS DE ATENÇÃO OBSERVÁVEIS (com evidências e incerteza)
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
                        messages: [{ role: 'user', content: promptOSINT }],
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
            try { groqData = rawGroq ? JSON.parse(rawGroq) : {}; }
            catch (_) { groqData = {}; }

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
            const ferramentas = Array.isArray(mensagemGroq?.executed_tools) ? mensagemGroq.executed_tools : [];

            if (!analiseIA) {
                console.error('[NOSFERATU] Groq respondeu sem conteúdo.', JSON.stringify(groqData).slice(0, 1200));
                return res.status(502).json({
                    erro: 'A Mente Abissal contactou as dimensões exteriores, mas voltou sem qualquer leitura.'
                });
            }

            if (ferramentas.length === 0) {
                console.warn('[NOSFERATU] Resposta recebida sem executed_tools; dossiê rejeitado para evitar análise não fundamentada.');
                return res.status(502).json({
                    erro: 'A Mente Abissal respondeu, mas não executou a varredura web exigida. O dossiê não foi gravado.'
                });
            }

            console.log(`[NOSFERATU] Varredura real concluída. Ferramentas externas usadas: ${ferramentas.length}.`);
        } catch(e) {
            const expirou = e?.name === 'AbortError';
            console.error('[NOSFERATU] Falha na varredura Groq Compound:', e);
            return res.status(expirou ? 504 : 502).json({
                erro: expirou
                    ? 'A varredura da Mente Abissal excedeu 60 segundos.'
                    : 'A Mente Abissal não conseguiu concluir a pesquisa externa.',
                detalhe: e?.message || 'Erro desconhecido'
            });
        }

        // Determinar cor da alma
'@

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backup = "$ServerPath.bak_mente_abissal_$timestamp"
Copy-Item $ServerPath $backup -Force

Write-Host "[1/4] Backup criado:" -ForegroundColor Cyan
Write-Host "      $backup"

$newContent = [regex]::Replace(
    $content,
    $pattern,
    "`r`n`r`n$replacement",
    1
)

[System.IO.File]::WriteAllText($ServerPath, $newContent, $utf8NoBom)

Write-Host "[2/4] Bloco antigo substituido por Groq Compound + pesquisa web real." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Copy-Item $backup $ServerPath -Force
    throw "Node.js nao encontrado no PATH. O backup foi restaurado."
}

Write-Host "[3/4] Validando sintaxe do server.js..." -ForegroundColor Cyan
& node --check $ServerPath
if ($LASTEXITCODE -ne 0) {
    Copy-Item $backup $ServerPath -Force
    throw "node --check falhou. O backup foi restaurado automaticamente."
}

$final = [System.IO.File]::ReadAllText($ServerPath, [System.Text.Encoding]::UTF8)
$checks = @(
    @{ Nome = "groq/compound"; Ok = $final.Contains("'groq/compound'") },
    @{ Nome = "web_search"; Ok = $final.Contains("'web_search'") },
    @{ Nome = "visit_website"; Ok = $final.Contains("'visit_website'") },
    @{ Nome = "citation_options"; Ok = $final.Contains("citation_options: 'enabled'") },
    @{ Nome = "modelo antigo removido deste fluxo"; Ok = -not ($final -match "model:\s*'llama-3\.3-70b-versatile'") }
)

$falhas = @($checks | Where-Object { -not $_.Ok })
foreach ($c in $checks) {
    $status = if ($c.Ok) { "[OK]" } else { "[FALHA]" }
    $color = if ($c.Ok) { "Green" } else { "Red" }
    Write-Host ("      {0} {1}" -f $status, $c.Nome) -ForegroundColor $color
}

if ($falhas.Count -gt 0) {
    Copy-Item $backup $ServerPath -Force
    throw "A verificacao final falhou. O backup foi restaurado."
}

Write-Host "[4/4] HOTFIX APLICADO COM SUCESSO." -ForegroundColor Green
Write-Host ""
Write-Host "Agora valide a chave e faca deploy:" -ForegroundColor Yellow
Write-Host "  fly secrets list -a ordem"
Write-Host "  git diff -- server.js"
Write-Host "  git add server.js"
Write-Host '  git commit -m "Fix Mente Abissal realtime OSINT with Groq Compound"'
Write-Host "  git push"
Write-Host "  fly deploy -a ordem"
Write-Host ""
Write-Host "Depois teste o Portal Nosferatu registrando uma identidade com nome + perfil/URL publica." -ForegroundColor Yellow
