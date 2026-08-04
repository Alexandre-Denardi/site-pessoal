import { DataTypes } from 'sequelize'

// 191 caracteres é o limite seguro para índice único em utf8mb4 no MySQL.
const CHAVE = 191

/**
 * Define todos os modelos numa instância do Sequelize.
 * @param {import('sequelize').Sequelize} sequelize
 */
export function definirModelos(sequelize) {
  const Usuario = sequelize.define(
    'Usuario',
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING(CHAVE), allowNull: false, unique: true },
      senhaHash: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'usuarios' },
  )

  const Midia = sequelize.define(
    'Midia',
    {
      arquivo: { type: DataTypes.STRING, allowNull: false },
      nomeOriginal: { type: DataTypes.STRING },
      mime: { type: DataTypes.STRING },
      tamanho: { type: DataTypes.INTEGER },
      largura: { type: DataTypes.INTEGER },
      altura: { type: DataTypes.INTEGER },
      alt: { type: DataTypes.STRING },
      credito: { type: DataTypes.STRING },
    },
    { tableName: 'midia' },
  )

  const Projeto = sequelize.define(
    'Projeto',
    {
      titulo: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING(CHAVE), allowNull: false, unique: true },
      resumo: { type: DataTypes.STRING(500), allowNull: false },
      categoria: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'infraestrutura' },
      status: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'concluido' },
      stack: { type: DataTypes.JSON, defaultValue: [] },
      inicio: { type: DataTypes.DATEONLY },
      fim: { type: DataTypes.DATEONLY },
      repositorio: { type: DataTypes.STRING },
      demo: { type: DataTypes.STRING },
      problema: { type: DataTypes.TEXT },
      resultado: { type: DataTypes.TEXT },
      conteudo: { type: DataTypes.TEXT('long') },
      destaque: { type: DataTypes.BOOLEAN, defaultValue: false },
      publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'projetos' },
  )

  const Nota = sequelize.define(
    'Nota',
    {
      titulo: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING(CHAVE), allowNull: false, unique: true },
      resumo: { type: DataTypes.STRING(500), allowNull: false },
      tipo: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'anotacao' },
      publicadoEm: { type: DataTypes.DATEONLY, allowNull: false },
      tags: { type: DataTypes.JSON, defaultValue: [] },
      conteudo: { type: DataTypes.TEXT('long') },
      destaque: { type: DataTypes.BOOLEAN, defaultValue: false },
      publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'notas' },
  )

  const Certificacao = sequelize.define(
    'Certificacao',
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      emissor: { type: DataTypes.STRING, allowNull: false },
      situacao: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'obtida' },
      emitidaEm: { type: DataTypes.DATEONLY },
      expiraEm: { type: DataTypes.DATEONLY },
      credencialUrl: { type: DataTypes.STRING },
      codigo: { type: DataTypes.STRING },
      descricao: { type: DataTypes.TEXT },
      destaque: { type: DataTypes.BOOLEAN, defaultValue: false },
      publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'certificacoes' },
  )

  const Experiencia = sequelize.define(
    'Experiencia',
    {
      cargo: { type: DataTypes.STRING, allowNull: false },
      empresa: { type: DataTypes.STRING, allowNull: false },
      local: { type: DataTypes.STRING },
      vinculo: { type: DataTypes.STRING(40), defaultValue: 'clt' },
      inicio: { type: DataTypes.DATEONLY, allowNull: false },
      fim: { type: DataTypes.DATEONLY },
      atual: { type: DataTypes.BOOLEAN, defaultValue: false },
      descricao: { type: DataTypes.TEXT },
      atividades: { type: DataTypes.JSON, defaultValue: [] },
      tecnologias: { type: DataTypes.JSON, defaultValue: [] },
      publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'experiencias' },
  )

  const Habilidade = sequelize.define(
    'Habilidade',
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      categoria: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'infraestrutura' },
      nivel: { type: DataTypes.STRING(40), defaultValue: 'intermediario' },
      ordem: { type: DataTypes.INTEGER, defaultValue: 100 },
      publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'habilidades' },
  )

  // Linha única (id = 1) com os dados do topo do site e contato.
  const Perfil = sequelize.define(
    'Perfil',
    {
      nome: { type: DataTypes.STRING, defaultValue: '' },
      headline: { type: DataTypes.STRING, defaultValue: '' },
      bio: { type: DataTypes.TEXT },
      sobre: { type: DataTypes.TEXT('long') },
      promptUsuario: { type: DataTypes.STRING, defaultValue: 'eu@infra' },
      frases: { type: DataTypes.JSON, defaultValue: [] },
      estatisticas: { type: DataTypes.JSON, defaultValue: [] },
      email: { type: DataTypes.STRING },
      localizacao: { type: DataTypes.STRING },
      disponivel: { type: DataTypes.BOOLEAN, defaultValue: true },
      redes: { type: DataTypes.JSON, defaultValue: [] },
      tituloSeo: { type: DataTypes.STRING },
      descricaoSeo: { type: DataTypes.STRING(500) },
    },
    { tableName: 'perfil' },
  )

  // ── Relações com a mídia ────────────────────────────────
  Projeto.belongsTo(Midia, { as: 'capa', foreignKey: 'capaId', constraints: false })
  Certificacao.belongsTo(Midia, { as: 'logo', foreignKey: 'logoId', constraints: false })
  Perfil.belongsTo(Midia, { as: 'foto', foreignKey: 'fotoId', constraints: false })
  Perfil.belongsTo(Midia, { as: 'curriculo', foreignKey: 'curriculoId', constraints: false })

  return { Usuario, Midia, Projeto, Nota, Certificacao, Experiencia, Habilidade, Perfil }
}
