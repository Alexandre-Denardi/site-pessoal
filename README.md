# Site pessoal — portfólio + CMS próprio

Site de portfólio com painel administrativo próprio.
**Next.js 16** + **Sequelize** + **MySQL**, em JavaScript puro (ESM), numa única
imagem Docker pronta para o Discloud.

O banco é o **seu MySQL** — informado numa tela de instalação no primeiro acesso,
como no GLPI.

| Rota              | O que é                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `/`               | Home: perfil, stack, experiência, certificações, projetos e notas |
| `/projetos`       | Lista com filtro por categoria                                    |
| `/projetos/:slug` | Página do projeto com a documentação completa                     |
| `/notas`          | Notas, runbooks e ideias                                          |
| `/notas/:slug`    | Página da nota                                                    |
| `/instalar`       | **Instalação** — conexão com o MySQL e cadastro do administrador  |
| `/entrar`         | Login do painel                                                   |
| `/admin`          | **Painel** — onde você edita tudo                                 |
| `/midia/:arquivo` | Serve os arquivos enviados pelo painel                            |

---

## Primeiro acesso

Ao abrir o site pela primeira vez ele manda para `/instalar`:

**Passo 1 — banco.** Você informa host, porta, banco, usuário e senha do MySQL.
A conexão é testada antes de gravar qualquer coisa; se falhar, a tela diz o motivo
(host inexistente, senha errada, banco inexistente, conexão recusada). Dando certo,
as tabelas são criadas no banco que você indicou e as credenciais ficam em
`data/config.json` com permissão `600`.

**Passo 2 — administrador.** Nome, e-mail e senha (mínimo 8 caracteres, guardada
com bcrypt). Ao criar, você já entra no painel.

O usuário do MySQL precisa de permissão para criar tabelas nesse banco.

---

## Rodar local

```bash
npm install
npm run db:up     # sobe um MySQL 8.4 no Docker
npm run dev
```

Abra `http://localhost:3000` e siga o instalador. Com o `docker-compose.yml` deste
repositório, os dados são: host `127.0.0.1`, porta `3306`, banco `site`, usuário
`site`, senha `site`.

**Sem Docker instalado?** Dá para desenvolver em SQLite:

```bash
npm i -D sqlite3
```

E no `.env`:

```
DB_DIALECT=sqlite
DB_HOST=local
DB_NAME=site
DB_STORAGE=./data/site.sqlite
APP_SECRET=qualquer-coisa-em-dev
```

Isso pula o passo 1 do instalador (as tabelas são criadas sozinhas) e você cai
direto no cadastro do administrador. **É só para desenvolvimento** — produção é MySQL.

---

## O que dá para gerenciar pelo `/admin`

- **Projetos** — título, resumo, categoria (infra/cloud/suporte/dev/automação/segurança),
  situação, capa, tecnologias, período, links, os campos _problema_ / _resultado_ e a
  documentação longa em **Markdown** (com botão de prévia).
- **Notas & ideias** — anotações, runbooks, ideias e post-mortems, com tags e data.
- **Certificações** — emissor, situação (obtida / em andamento / planejada), datas,
  link de verificação e logo.
- **Experiências** — cargo, empresa, período, entregas e tecnologias. Vira a linha do
  tempo da home.
- **Stack & habilidades** — agrupadas por área; o que estiver como _avançado_ ganha
  destaque em verde.
- **Perfil & contato** — nome, headline, bio, texto "Sobre", foto, currículo em PDF,
  e-mail, redes, números em destaque e **as frases que o terminal digita** no topo.
- **Mídia** — upload de imagens e PDFs. É aqui que os arquivos entram; depois você os
  seleciona no item que os usa:

  | Onde você seleciona                | Onde aparece no site                       |
  | ---------------------------------- | ------------------------------------------ |
  | Certificação → _Logo / badge_      | Ícone ao lado do emissor, no card           |
  | Projeto → _Imagem de capa_         | Topo do card e da página do projeto         |
  | Perfil → _Foto_                    | Ao lado do nome, no bloco do terminal       |
  | Perfil → _Currículo (PDF)_         | Botão `./baixar-cv` no topo                 |

Todo item tem a chave **Publicado**: desmarque para tirar do ar sem apagar.

### Acrescentar um campo novo

1. Descreva o campo em [`src/admin/esquemas.js`](src/admin/esquemas.js) — isso já gera
   o formulário e a coluna da listagem.
2. Acrescente o atributo em [`src/bd/modelos.js`](src/bd/modelos.js).
3. Gere e escreva a migration:

```bash
npm run db:migrate:novo -- adiciona-campo-x
```

4. Aplique com `npm run db:migrate` (local) ou pelo botão **sincronizar estrutura do
   banco** no painel (produção).

---

## Migrations

O schema é versionado em `migrations/`. Nada de `sync({ alter: true })` em produção.

```bash
npm run db:migrate           # aplica as pendentes
npm run db:migrate:status    # lista aplicadas e pendentes
npm run db:migrate:undo      # desfaz a última
npm run db:migrate:novo -- nome-da-migration
```

Os arquivos seguem o formato do `sequelize-cli` (`up`/`down` recebendo
`queryInterface` e `Sequelize`), com extensão `.cjs` porque o projeto é ESM. Quem
executa é o **Umzug** — a mesma engine por trás do `sequelize-cli` — porque as
migrations também precisam rodar de dentro da aplicação: no instalador as credenciais
só existem depois que você preenche o formulário, e a imagem Docker (`output:
standalone`) não leva o CLI junto.

Pelo painel, **sincronizar estrutura do banco** aplica as pendentes sem terminal.

**Banco criado antes das migrations existirem:** é detectado sozinho — a estrutura
inicial é marcada como aplicada e só as migrations seguintes rodam, sem tentar
recriar tabela que já existe.

---

## Deploy no Discloud

`discloud.config` já vem pronto:

```
NAME=Site Pessoal
ID=alexandre
TYPE=site
MAIN=Dockerfile
RAM=512
VERSION=latest
AUTORESTART=true
```

Troque o `ID` pelo subdomínio que você registrou (vira `<id>.discloud.app`).
Requisitos da plataforma: plano **Platinum ou superior** para `TYPE=site` e a
aplicação escutando na **porta 8080** — o Dockerfile já faz isso. Se o app reiniciar
por falta de memória, suba o `RAM` para `1024`.

Compacte a pasta e envie pelo painel, CLI, bot do Discord ou extensão do VS Code.
O `.discloudignore` já exclui `node_modules/`, `.next/` e `data/` — o build
acontece no servidor.

Como o MySQL está na rede interna do Discloud, informe no instalador o host interno
do banco.

### Variáveis de ambiente (todas opcionais)

| Variável                 | Para quê                                        |
| ------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL` | `https://<seu-id>.discloud.app` — canonical e OG |
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASS` | Pulam o instalador     |
| `APP_SECRET`             | Assina o cookie de sessão (obrigatória se usar as `DB_*`) |

Gere o `APP_SECRET` com:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Persistência

Seus **dados de conteúdo — inclusive os arquivos enviados pelo painel (imagens, logos,
currículo) — estão no seu MySQL**, como BLOB. Redeploy não encosta neles. A única coisa
que fica dentro do container é `data/config.json`, com as credenciais do banco.

Se o Discloud descartar o volume num redeploy, o efeito é só: o site pede a instalação
de novo (basta reinformar as credenciais; todo o conteúdo, incluindo mídia, continua no
banco). Para eliminar isso de vez, defina as variáveis `DB_*` e `APP_SECRET` no painel
do Discloud — aí o instalador nem aparece e o `config.json` deixa de importar.

---

## Versionamento e CI

O repositório usa [SemVer](https://semver.org/lang/pt-BR/) e um
[CHANGELOG.md](CHANGELOG.md). Para marcar uma versão:

```bash
npm version minor -m "release: v%s"
```

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda a cada push e
pull request, com três verificações:

| Job          | O que garante                                              |
| ------------ | ---------------------------------------------------------- |
| `build`      | o Next.js compila                                           |
| `imagem`     | o `Dockerfile` monta — o mesmo build que o Discloud fará    |
| `migracoes`  | as migrations aplicam num MySQL 8.4 de verdade              |

### Deploy

O Discloud tem integração nativa com GitHub nos planos pagos: conecte o repositório
pelo painel e escolha a branch — cada push nela atualiza a aplicação. Não é preciso
workflow de deploy aqui; o CI existe para o push só acontecer com o build passando.

Sem a integração, o fluxo é compactar a pasta e enviar pelo painel ou pela CLI.

---

## Estrutura

```
src/
  app/
    (frontend)/     site público — home, projetos, notas
    (sistema)/      instalar, entrar e o painel /admin
    midia/          serve os uploads
  admin/
    esquemas.js     definição de cada entidade (gera listas e formulários)
    acoes.js        server actions de gravar, excluir e upload
  bd/
    config.js       credenciais (variáveis de ambiente ou data/config.json)
    conexao.js      instância do Sequelize e teste de conexão
    migracoes.js    executor das migrations (Umzug) e baseline
    modelos.js      as tabelas
migrations/         schema versionado (formato sequelize-cli, em .cjs)
scripts/migrar.mjs  CLI de migrations usada pelos scripts npm
  componentes/      Janela, cartões, terminal digitando, formulários do painel
  lib/              consultas, sessão, markdown, formatação
Dockerfile          build + runtime, processo único na porta 8080
discloud.config     configuração de deploy
```

O visual fica todo em [`src/app/globals.css`](src/app/globals.css) — as cores são
variáveis CSS no topo do arquivo, tema escuro e claro. Mexeu ali, mudou o site inteiro.
