# SANGUINIS · O pacto do sangue

Rework do projeto original em uma plataforma de estudo esotérico e jogo de ação multiplayer no navegador. Interface em português, movimento e combate em tempo real, cinco regiões, ordens, biblioteca, diário e economia de vitae.

## Abrir o projeto

Com Node.js 20 ou superior, execute `npm ci` e `npm start`. Abra http://localhost:8080. Se essa porta estiver ocupada, defina `PORT` antes de iniciar. A prévia desta atualização foi iniciada em http://localhost:8081.

O jogo funciona sem serviços externos. A configuração de IA já existente em `.env` é reaproveitada pelo tutor. O novo servidor não inicia o bot Telegram nem se conecta automaticamente ao MongoDB anterior.

Use **Iniciar jornada** para escolher uma linhagem. Um personagem visitante fica associado a um cookie de sessão; **Salvar personagem** cria uma conta com senha. Em **Legado anterior**, o nome e a palavra de poder originais verificam a propriedade antes de adaptar um personagem antigo.

## Jogabilidade

- WASD ou setas: movimentação. Clique esquerdo: golpe. Clique direito: destino.
- 1–4: habilidades; Espaço: esquiva; E: coletar; Q: elixir.
- No celular, toque para definir um destino ou use o direcional e os botões de ação.
- Caçadas fornecem experiência, vitae, cinzas e relíquias procedurais. Colete lótus e ferro para a forja.
- Quebre a postura de uma criatura para dobrar o dano. Círculos vermelhos antecipam ataques.
- A Cripta de Salomão é uma instância solo ou de grupo de até quatro pessoas.
- O ciclo lunar do jogo dura 30 minutos. Os 10 minutos finais abrem PvP e captura do obelisco nos Ermos. É um ciclo de jogo acelerado, não a fase astronômica real.
- Rituais usam uma sequência de cinco sigilos. Pactos consomem recursos, têm duração e modificam dano ou proteção.
- Fórmulas visuais e operadores do código antigo produzem efeitos limitados e calculados no servidor. Não se executa JavaScript fornecido por usuários.

## Plataforma de estudos

Ordens têm carta, tradição, conselho, cargos, cofre, santuário, matriz, decretos, encontros e provações revisadas por outro integrante. Os graus são próprios da plataforma; não conferem filiação, titulação ou reconhecimento por ordens externas.

A biblioteca reúne material de curadoria, textos dos integrantes e estudos por IA. Um estudo pode ser privado, compartilhado com a ordem ou público. O diário separa intenção, observação e reflexão. Há comentários, aprofundamento pelo tutor e cristalização de um estudo em feitiço ou relíquia do jogo. O acervo pessoal pode ser exportado.

**Magia e efeitos:** as tradições fornecem o modelo simbólico. Os efeitos verificáveis desta implementação são operações do software: alteração de atributos, recursos, permissões, registros e progressão. O sistema não demonstra efeitos sobrenaturais sobre pessoas.

## Economia e comunidade

Gts de vitae são a moeda digital do jogo. Há forja, mercado entre jogadores, banco, transferências, contratos com caução, ofertas privadas de itens em custódia, pactos com aceite das duas partes, transfusão entre personagens e caldeirão comunitário. Não existe conversão em dinheiro real.

O refúgio mantém muralhas, torre, forja, fonte, servos e familiar. A oferenda diária e o Ouroboros foram adaptados. A guerra continua dividida por espécie; uma ordem de estudo pode reunir ambas.

## Arquivo reservado e fontes públicas

Disponível a partir do grau iniciático 5 ou para uma conta antiga de mestre verificada. O conector implementado consulta a API pública do GitHub em tempo real, mediante declaração de participação própria ou consentimento da pessoa. Registra fonte, horário, biografia pública e contagens públicas; não registra contatos, endereço ou localização. Os registros são privados, podem ser excluídos e recebem apenas um vínculo simbólico interno.

**Instagram, Facebook, X, LinkedIn e outras redes não têm conectores implementados nesta versão.** Sua integração depende de APIs oficiais e permissões. O sistema não contorna conteúdo privado e não oferece ações sobre pessoas reais. Dossiês pessoais da versão antiga não são republicados automaticamente.

## Arte

Dez imagens foram geradas pela ferramenta integrada `image_gen`: quatro ambientes, dois retratos e quatro personagens/inimigos com transparência. Originais e versões WebP estão em `public/art`; mestres ampliados em 4K estão em `public/art/4k`.

Os originais entregues pelo gerador medem **1672×941** ou **941×1672**. As versões **3840×2160** e **2160×3840** foram ampliadas com interpolação bicúbica; não são geração nativa em 4K. O navegador carrega os WebP menores. Prompts e origem constam em `docs/art-manifest.json`.

## Validação

- `npm test`: regras do mundo, privacidade, autorização, sessões, economia e contratos.
- `npm run check`: verificação de sintaxe.
- `node tests/browser.cjs`: teste de navegador com duas sessões, movimentação, chat, estudos, ordens, ritual e layouts móveis. O script aceita `SANGUINIS_PLAYWRIGHT` e `SANGUINIS_BROWSER` para apontar as dependências de teste.
- Evidências visuais: `output/qa`.

## Persistência e publicação

`data/sanguinis_banco.json` permanece preservado. A nova versão grava `rework-world.json` com substituição atômica e salvamento periódico. `SANGUINIS_DATA_DIR` define a pasta persistente. Dados e código interno não são servidos pela aplicação.

O Docker inicia o servidor novo e exclui ambiente, bancos, backups e arquivos de trabalho da imagem. A configuração Fly usa um volume `sanguinis_data` montado em `/data`; esse volume precisa existir antes de publicar. Para recuperar contas anteriores em produção, copie o banco original para esse volume por um canal administrativo, sem torná-lo público.

**Esta entrega é uma versão local jogável, testada com duas sessões, em um único processo de servidor.** Publicação, recuperação de backup em infraestrutura real, testes de carga, distribuição entre servidores, moderação operacional e integrações sociais adicionais ainda precisam de trabalho antes de considerá-la um MMO de produção em grande escala. Nenhuma publicação externa foi realizada.

A versão original e seus módulos continuam disponíveis para referência. `npm run start:legacy` abre o servidor antigo com a interface preservada em `legacy/index.html`; ele mantém suas dependências e regras anteriores e não é usado pelo servidor novo. Consulte `docs/adaptacao.md` para o mapa de adaptações e diferenças.
