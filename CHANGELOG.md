# Changelog

Segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
[SemVer](https://semver.org/lang/pt-BR/).

## [Não publicado]

## [1.0.0] — 2026-08-04

Primeira versão do site pessoal com CMS próprio.

### Adicionado

- Site público com design de terminal em tons de verde, tema claro e escuro:
  home com perfil, stack, linha do tempo de experiência, certificações, projetos
  e notas; listagens com filtro por categoria; páginas individuais.
- Painel administrativo próprio em `/admin`, com CRUD gerado a partir de
  `src/admin/esquemas.js` — projetos, notas, certificações, experiências, stack,
  perfil e biblioteca de mídia.
- Instalador em `/instalar`: informa host, banco, usuário e senha do MySQL,
  testa a conexão, aplica as migrations e cadastra o administrador.
- Autenticação com bcrypt e sessão em cookie assinado (HMAC-SHA256).
- Conteúdo longo em Markdown, com prévia no editor.
- Upload de imagens e PDF, servidos por `/midia/:arquivo` com cache imutável.
- Migrations versionadas com Umzug, com baseline automático para bancos criados
  antes das migrations existirem.
- Imagem Docker de processo único na porta 8080, pronta para o Discloud.
- CI no GitHub Actions: build da aplicação, build da imagem Docker e migrations
  contra um MySQL real.

### Notas de migração

Bancos criados antes desta versão são detectados automaticamente: a estrutura
inicial é marcada como aplicada e só as migrations seguintes rodam. Use
**sincronizar estrutura do banco** no painel ou `npm run db:migrate`.

[não publicado]: https://github.com/SEU-USUARIO/site-pessoal/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SEU-USUARIO/site-pessoal/releases/tag/v1.0.0
