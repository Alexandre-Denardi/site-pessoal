/**
 * Definição única de cada entidade do painel.
 * Lista, formulário e gravação são gerados a partir daqui — para acrescentar
 * um campo novo no site, basta descrevê-lo neste arquivo.
 *
 * Tipos de campo: texto | textarea | markdown | select | data | booleano |
 *                 numero | lista | midia | repetivel
 */

const CATEGORIAS_PROJETO = [
  { valor: 'infraestrutura', rotulo: 'Infraestrutura' },
  { valor: 'cloud', rotulo: 'Cloud' },
  { valor: 'suporte', rotulo: 'Suporte' },
  { valor: 'desenvolvimento', rotulo: 'Desenvolvimento' },
  { valor: 'automacao', rotulo: 'Automação' },
  { valor: 'seguranca', rotulo: 'Segurança' },
]

const CATEGORIAS_STACK = [
  { valor: 'infraestrutura', rotulo: 'Infraestrutura' },
  { valor: 'cloud', rotulo: 'Cloud' },
  { valor: 'redes', rotulo: 'Redes' },
  { valor: 'sistemas', rotulo: 'Sistemas & Workspace' },
  { valor: 'desenvolvimento', rotulo: 'Desenvolvimento' },
  { valor: 'seguranca', rotulo: 'Segurança' },
  { valor: 'ferramentas', rotulo: 'Ferramentas' },
]

export const ESQUEMAS = {
  projetos: {
    modelo: 'Projeto',
    singular: 'Projeto',
    plural: 'Projetos',
    comando: 'ls ~/projetos',
    descricao: 'Cada trabalho que você quer mostrar.',
    slugDe: 'titulo',
    ordenar: [
      ['inicio', 'DESC'],
      ['id', 'DESC'],
    ],
    colunas: [
      { campo: 'titulo', rotulo: 'Título' },
      { campo: 'categoria', rotulo: 'Categoria' },
      { campo: 'status', rotulo: 'Situação' },
      { campo: 'publicado', rotulo: 'Publicado', tipo: 'booleano' },
    ],
    campos: [
      { nome: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true, maxLength: 255 },
      {
        nome: 'slug',
        rotulo: 'Slug (URL)',
        tipo: 'texto',
        maxLength: 191,
        ajuda: 'Deixe vazio para gerar do título.',
      },
      {
        nome: 'resumo',
        rotulo: 'Resumo',
        tipo: 'textarea',
        obrigatorio: true,
        maxLength: 500,
        ajuda: 'Uma ou duas frases — aparece no card.',
      },
      {
        nome: 'categoria',
        rotulo: 'Categoria',
        tipo: 'select',
        opcoes: CATEGORIAS_PROJETO,
        padrao: 'infraestrutura',
        largura: 'metade',
      },
      {
        nome: 'status',
        rotulo: 'Situação',
        tipo: 'select',
        largura: 'metade',
        padrao: 'concluido',
        opcoes: [
          { valor: 'concluido', rotulo: 'Concluído' },
          { valor: 'em-andamento', rotulo: 'Em andamento' },
          { valor: 'manutencao', rotulo: 'Em manutenção' },
          { valor: 'descontinuado', rotulo: 'Descontinuado' },
        ],
      },
      { nome: 'inicio', rotulo: 'Início', tipo: 'data', largura: 'metade' },
      { nome: 'fim', rotulo: 'Conclusão', tipo: 'data', largura: 'metade' },
      {
        nome: 'stack',
        rotulo: 'Tecnologias',
        tipo: 'lista',
        ajuda: 'Uma por linha. Ex.: Microsoft 365, AWS Route 53, PowerShell.',
      },
      { nome: 'capaId', rotulo: 'Imagem de capa', tipo: 'midia' },
      { nome: 'repositorio', rotulo: 'Repositório', tipo: 'texto', largura: 'metade', maxLength: 255 },
      { nome: 'demo', rotulo: 'Demo / site', tipo: 'texto', largura: 'metade', maxLength: 255 },
      { nome: 'problema', rotulo: 'O problema', tipo: 'textarea', ajuda: 'Qual era a dor.' },
      { nome: 'resultado', rotulo: 'O resultado', tipo: 'textarea', ajuda: 'Números, ganho de tempo…' },
      {
        nome: 'conteudo',
        rotulo: 'Documentação',
        tipo: 'markdown',
        ajuda: 'Contexto, arquitetura, decisões, comandos.',
      },
      { nome: 'destaque', rotulo: 'Destacar na home', tipo: 'booleano', largura: 'metade' },
      { nome: 'publicado', rotulo: 'Publicado', tipo: 'booleano', padrao: true, largura: 'metade' },
    ],
  },

  notas: {
    modelo: 'Nota',
    singular: 'Nota',
    plural: 'Notas & ideias',
    comando: 'ls ~/notas',
    descricao: 'Anotações técnicas, runbooks e ideias.',
    slugDe: 'titulo',
    ordenar: [
      ['publicadoEm', 'DESC'],
      ['id', 'DESC'],
    ],
    colunas: [
      { campo: 'titulo', rotulo: 'Título' },
      { campo: 'tipo', rotulo: 'Tipo' },
      { campo: 'publicadoEm', rotulo: 'Data', tipo: 'data' },
      { campo: 'publicado', rotulo: 'Publicado', tipo: 'booleano' },
    ],
    campos: [
      { nome: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true, maxLength: 255 },
      {
        nome: 'slug',
        rotulo: 'Slug (URL)',
        tipo: 'texto',
        maxLength: 191,
        ajuda: 'Deixe vazio para gerar do título.',
      },
      { nome: 'resumo', rotulo: 'Resumo', tipo: 'textarea', obrigatorio: true, maxLength: 500 },
      {
        nome: 'tipo',
        rotulo: 'Tipo',
        tipo: 'select',
        largura: 'metade',
        padrao: 'anotacao',
        opcoes: [
          { valor: 'anotacao', rotulo: 'Anotação técnica' },
          { valor: 'runbook', rotulo: 'Runbook / passo a passo' },
          { valor: 'ideia', rotulo: 'Ideia' },
          { valor: 'post-mortem', rotulo: 'Post-mortem' },
        ],
      },
      {
        nome: 'publicadoEm',
        rotulo: 'Data',
        tipo: 'data',
        largura: 'metade',
        obrigatorio: true,
        padrao: () => new Date().toISOString().slice(0, 10),
      },
      { nome: 'tags', rotulo: 'Tags', tipo: 'lista', ajuda: 'Uma por linha. Ex.: m365, dns, docker.' },
      { nome: 'conteudo', rotulo: 'Conteúdo', tipo: 'markdown', obrigatorio: true },
      { nome: 'destaque', rotulo: 'Destacar na home', tipo: 'booleano', largura: 'metade' },
      { nome: 'publicado', rotulo: 'Publicado', tipo: 'booleano', padrao: true, largura: 'metade' },
    ],
  },

  certificacoes: {
    modelo: 'Certificacao',
    singular: 'Certificação',
    plural: 'Certificações',
    comando: 'ls ~/certificacoes',
    descricao: 'Credenciais obtidas, em andamento e planejadas.',
    ordenar: [
      ['situacao', 'ASC'],
      ['emitidaEm', 'DESC'],
    ],
    colunas: [
      { campo: 'nome', rotulo: 'Nome' },
      { campo: 'emissor', rotulo: 'Emissor' },
      { campo: 'situacao', rotulo: 'Situação' },
      { campo: 'emitidaEm', rotulo: 'Emitida', tipo: 'data' },
    ],
    campos: [
      {
        nome: 'nome',
        rotulo: 'Nome da certificação',
        tipo: 'texto',
        obrigatorio: true,
        maxLength: 255,
      },
      {
        nome: 'emissor',
        rotulo: 'Emissor',
        tipo: 'texto',
        obrigatorio: true,
        largura: 'metade',
        maxLength: 255,
        ajuda: 'Google, AWS, Microsoft…',
      },
      {
        nome: 'situacao',
        rotulo: 'Situação',
        tipo: 'select',
        largura: 'metade',
        padrao: 'obtida',
        opcoes: [
          { valor: 'obtida', rotulo: 'Obtida' },
          { valor: 'em-andamento', rotulo: 'Em andamento' },
          { valor: 'planejada', rotulo: 'Planejada' },
        ],
      },
      { nome: 'emitidaEm', rotulo: 'Emitida em', tipo: 'data', largura: 'metade' },
      { nome: 'expiraEm', rotulo: 'Expira em', tipo: 'data', largura: 'metade' },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' },
      {
        nome: 'credencialUrl',
        rotulo: 'Link da credencial',
        tipo: 'texto',
        largura: 'metade',
        maxLength: 255,
      },
      { nome: 'codigo', rotulo: 'Código', tipo: 'texto', largura: 'metade', maxLength: 255 },
      { nome: 'logoId', rotulo: 'Logo / badge', tipo: 'midia' },
      { nome: 'destaque', rotulo: 'Destacar', tipo: 'booleano', largura: 'metade' },
      { nome: 'publicado', rotulo: 'Publicado', tipo: 'booleano', padrao: true, largura: 'metade' },
    ],
  },

  experiencias: {
    modelo: 'Experiencia',
    singular: 'Experiência',
    plural: 'Experiências',
    comando: 'cat ~/experiencia.log',
    descricao: 'A linha do tempo profissional da home.',
    ordenar: [
      ['atual', 'DESC'],
      ['inicio', 'DESC'],
    ],
    colunas: [
      { campo: 'cargo', rotulo: 'Cargo' },
      { campo: 'empresa', rotulo: 'Empresa' },
      { campo: 'inicio', rotulo: 'Início', tipo: 'data' },
      { campo: 'atual', rotulo: 'Atual', tipo: 'booleano' },
    ],
    campos: [
      {
        nome: 'cargo',
        rotulo: 'Cargo',
        tipo: 'texto',
        obrigatorio: true,
        largura: 'metade',
        maxLength: 255,
      },
      {
        nome: 'empresa',
        rotulo: 'Empresa',
        tipo: 'texto',
        obrigatorio: true,
        largura: 'metade',
        maxLength: 255,
      },
      {
        nome: 'local',
        rotulo: 'Local',
        tipo: 'texto',
        largura: 'metade',
        maxLength: 255,
        ajuda: 'Cidade/UF ou "Remoto".',
      },
      {
        nome: 'vinculo',
        rotulo: 'Vínculo',
        tipo: 'select',
        largura: 'metade',
        padrao: 'clt',
        opcoes: [
          { valor: 'clt', rotulo: 'CLT' },
          { valor: 'pj', rotulo: 'PJ' },
          { valor: 'freelance', rotulo: 'Freelance' },
          { valor: 'estagio', rotulo: 'Estágio' },
        ],
      },
      { nome: 'inicio', rotulo: 'Início', tipo: 'data', obrigatorio: true, largura: 'metade' },
      { nome: 'fim', rotulo: 'Saída', tipo: 'data', largura: 'metade', ajuda: 'Deixe vazio se for o emprego atual.' },
      { nome: 'atual', rotulo: 'Emprego atual', tipo: 'booleano' },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' },
      { nome: 'atividades', rotulo: 'Principais entregas', tipo: 'lista', ajuda: 'Uma por linha.' },
      { nome: 'tecnologias', rotulo: 'Tecnologias', tipo: 'lista', ajuda: 'Uma por linha.' },
      { nome: 'publicado', rotulo: 'Publicado', tipo: 'booleano', padrao: true },
    ],
  },

  habilidades: {
    modelo: 'Habilidade',
    singular: 'Habilidade',
    plural: 'Stack & habilidades',
    comando: 'ls ~/stack',
    descricao: 'As tecnologias agrupadas por área na home.',
    ordenar: [
      ['ordem', 'ASC'],
      ['nome', 'ASC'],
    ],
    colunas: [
      { campo: 'nome', rotulo: 'Nome' },
      { campo: 'categoria', rotulo: 'Categoria' },
      { campo: 'nivel', rotulo: 'Nível' },
      { campo: 'ordem', rotulo: 'Ordem' },
    ],
    campos: [
      {
        nome: 'nome',
        rotulo: 'Nome',
        tipo: 'texto',
        obrigatorio: true,
        largura: 'metade',
        maxLength: 255,
      },
      {
        nome: 'categoria',
        rotulo: 'Categoria',
        tipo: 'select',
        opcoes: CATEGORIAS_STACK,
        padrao: 'infraestrutura',
        largura: 'metade',
      },
      {
        nome: 'nivel',
        rotulo: 'Nível',
        tipo: 'select',
        largura: 'metade',
        padrao: 'intermediario',
        opcoes: [
          { valor: 'basico', rotulo: 'Básico' },
          { valor: 'intermediario', rotulo: 'Intermediário' },
          { valor: 'avancado', rotulo: 'Avançado' },
        ],
      },
      {
        nome: 'ordem',
        rotulo: 'Ordem',
        tipo: 'numero',
        padrao: 100,
        largura: 'metade',
        ajuda: 'Menor aparece primeiro.',
      },
      { nome: 'publicado', rotulo: 'Publicado', tipo: 'booleano', padrao: true },
    ],
  },
}

/** Campos do perfil (registro único, sem lista). */
export const CAMPOS_PERFIL = [
  {
    nome: 'nome',
    rotulo: 'Nome',
    tipo: 'texto',
    obrigatorio: true,
    largura: 'metade',
    maxLength: 255,
  },
  {
    nome: 'headline',
    rotulo: 'Headline',
    tipo: 'texto',
    obrigatorio: true,
    largura: 'metade',
    maxLength: 255,
    ajuda: 'Ex.: Analista de TI · Infraestrutura, Cloud e Suporte',
  },
  { nome: 'bio', rotulo: 'Bio curta', tipo: 'textarea', ajuda: 'Aparece no bloco do terminal, no topo.' },
  { nome: 'sobre', rotulo: 'Sobre (texto longo)', tipo: 'markdown' },
  { nome: 'fotoId', rotulo: 'Foto', tipo: 'midia', largura: 'metade' },
  { nome: 'curriculoId', rotulo: 'Currículo (PDF)', tipo: 'midia', largura: 'metade' },
  {
    nome: 'promptUsuario',
    rotulo: 'Prompt do terminal',
    tipo: 'texto',
    padrao: 'eu@infra',
    largura: 'metade',
    maxLength: 255,
    ajuda: 'O que aparece antes do :~$',
  },
  {
    nome: 'frases',
    rotulo: 'Frases digitadas',
    tipo: 'lista',
    ajuda: 'Uma por linha — o terminal digita em loop.',
  },
  {
    nome: 'estatisticas',
    rotulo: 'Números em destaque',
    tipo: 'repetivel',
    subcampos: [
      { nome: 'valor', rotulo: 'Valor' },
      { nome: 'rotulo', rotulo: 'Rótulo' },
    ],
  },
  { nome: 'email', rotulo: 'E-mail', tipo: 'texto', largura: 'metade', maxLength: 255 },
  { nome: 'localizacao', rotulo: 'Localização', tipo: 'texto', largura: 'metade', maxLength: 255 },
  { nome: 'disponivel', rotulo: 'Disponível para oportunidades', tipo: 'booleano' },
  {
    nome: 'redes',
    rotulo: 'Links de contato',
    tipo: 'repetivel',
    subcampos: [
      { nome: 'rede', rotulo: 'Rede' },
      { nome: 'rotulo', rotulo: 'Rótulo' },
      { nome: 'url', rotulo: 'URL' },
    ],
  },
  { nome: 'tituloSeo', rotulo: 'Título da aba', tipo: 'texto', maxLength: 255 },
  { nome: 'descricaoSeo', rotulo: 'Descrição (SEO)', tipo: 'textarea', maxLength: 500 },
]

export const getEsquema = (entidade) => ESQUEMAS[entidade] ?? null

export const ENTIDADES = Object.entries(ESQUEMAS).map(([chave, e]) => ({
  chave,
  plural: e.plural,
}))
