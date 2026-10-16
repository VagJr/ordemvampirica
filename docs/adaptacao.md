# Conteúdo original e adaptação

O projeto original foi auditado antes da reescrita. Ele reúne `ShadowCore`, `LexiconSanguinis`, `OrdemMagicaCore`, `CombatEngine`, `MundoAberto2D`, `SocialCore` e `GeradorDeItensProcedural`. A base local auditada contém 43 personagens, uma ordem e 37 rituais no catálogo carregado. Não foram criados jogadores fictícios para simular população online.

| Conteúdo | Adaptação na interface nova |
|---|---|
| Linhagens vampírica e lycan | Escolha de espécie, retratos, habilidades, dreno e bônus lunar |
| Combate, postura e golpe visceral | Mundo contínuo, ataques direcionais, postura e dano dobrado na vulnerabilidade |
| Mundo 2D | Cinco regiões, movimento sincronizado, coleta, captura e minimapa |
| Dungeons | Cripta instanciada, chefe compartilhado e grupos de até quatro |
| Grimório e tradições | Catálogo original integrado ao grimório; efeitos e custos rebalanceados |
| Lexicon e palavras de poder | Decodificação original aplicada aos pactos; sigilos e memória visual |
| Magia em código | Validador original conservado; operadores com execução limitada e segura |
| Graus iniciáticos | Estrutura de graus original; gnose e revisão humana de trabalhos |
| Conselho, cargos e santuário | Carta, cargos, decretos, cofre, evolução e cerimônias |
| Egrégora e matriz | Doações, oito tipos de nós e efeitos concretos nos atributos e combate |
| Biblioteca e pesquisa | Tomos, quiz de curadoria, tutor IA, aprofundamento, comentários e compartilhamento |
| Cristalização | Estudos próprios ou assimilados podem originar feitiços e relíquias |
| Projetos e manuscritos antigos | Importação privada após autenticação; registro de origem conservado |
| Relíquias procedurais | Gerador original usado no espólio; inventário e equipamento simplificados |
| Mercado e leilão | Mercado P2P com item em custódia; preço em vitae |
| Banco, transferências e contratos | Cálice, livro de operações, caução e entrega de recursos |
| Vínculos e transfusão | Convites internos, aceite bilateral, encerramento e cura cooperativa |
| Trocas diretas e caldeirão | Ofertas privadas em custódia e bônus comunitário por doação |
| Reino, construções e servos | Refúgio pessoal com estruturas, coleta por servos e familiar |
| Oferendas e Ouroboros | Recompensa diária e renascimento a partir do nível 100 |
| Chat | Mensagens reais entre sessões autenticadas |
| OSINT e câmara de mestres | Arquivo privado consentido, fonte pública em tempo real e sigilo simbólico |

## Diferenças e limites

- A nova versão **não reutiliza todas as rotas antigas nem todas as regras numéricas anteriores**. As mecânicas relacionadas foram reconstruídas. A versão anterior foi conservada integralmente como referência executável.
- A hierarquia de estudos é separada do nível de combate. Graus não são atribuídos pela IA nem confundidos com credenciais externas.
- O combate anterior em turnos foi substituído por uma simulação contínua própria; o `CombatEngine` original fica preservado no legado.
- O mapa antigo de 80×80, cercos de construções em campo, efeitos especiais de todas as relíquias, múltiplos slots e cada evento procedural do Oráculo **não têm equivalência individual completa**. Na nova versão, estão representados por regiões, captura do obelisco, dois slots, matriz e refúgio. Voz/WebRTC, notificações Telegram e assinatura premium ficaram no legado.
- A fase lunar astronômica original permanece no módulo anterior; o jogo novo usa um ciclo acelerado descrito na interface.
- Os nomes e referências originais foram preservados, mas os efeitos dos rituais foram normalizados para dano em área, cura ou proteção. Um texto de lore não é uma instrução para prática com sangue humano.
- Equipamentos, saldo, nível, materiais e conhecimentos migrados podem ser rebalanceados; a cópia original não é sobrescrita. Senhas anteriores só são verificadas no servidor.
- A importação depende de o arquivo local antigo conter o personagem. Não houve leitura ou alteração do MongoDB externo.
- Os dossiês de terceiros do sistema anterior permanecem na fonte original; não foram migrados para uso público. O novo arquivo não permite negociar pessoas, obter contatos privados nem executar coerção ou supostos ataques sobrenaturais.

## Organização de ordens: pesquisa aplicada

A AMORC descreve estudos graduados individuais e iniciativas comunitárias; a O.T.O. descreve sua estrutura própria de iniciação. Estes exemplos inspiraram a distinção entre estudo, encontro, responsabilidade administrativa e passagem de grau. A plataforma não os representa nem reproduz seus ritos reservados.

Fontes públicas consultadas em 4 de outubro de 2026:

- [AMORC: estudos por graus](https://www.rosicrucian.org/home-study-lessons)
- [AMORC: iniciação e comunidade](https://www.rosicrucian.org/initiation-and-community)
- [O.T.O.: iniciação](https://oto-usa.org/oto/initiation/)
- [Bodleian: acervos digitais](https://www.bodleian.ox.ac.uk/collections-and-resources/special-collections/digital-collections)
- [Bibliotheca Philosophica Hermetica: acervo, pesquisa e comunidade](https://www.ritmanlibrary.com/wp-content/uploads/2014/01/bph-policy_plan-annual_report-2012-14.pdf)
- [GitHub: API de perfis públicos](https://docs.github.com/en/rest/users/users#get-a-user)

As monografias de curadoria são textos novos de contextualização, não transcrições dos materiais privados dessas organizações. O Caibalion é identificado como obra moderna de 1908.
