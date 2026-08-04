'use strict'

/**
 * Estrutura inicial do site.
 *
 * Bancos criados antes das migrations existirem são marcados automaticamente
 * como já tendo aplicado esta migration (ver src/bd/migracoes.js).
 */

const CHAVE = 191 // limite seguro para índice único em utf8mb4

module.exports = {
  async up(queryInterface, Sequelize) {
    const comuns = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }

    await queryInterface.createTable('usuarios', {
      ...comuns,
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING(CHAVE), allowNull: false, unique: true },
      senhaHash: { type: Sequelize.STRING, allowNull: false },
    })

    await queryInterface.createTable('midia', {
      ...comuns,
      arquivo: { type: Sequelize.STRING, allowNull: false },
      nomeOriginal: { type: Sequelize.STRING },
      mime: { type: Sequelize.STRING },
      tamanho: { type: Sequelize.INTEGER },
      largura: { type: Sequelize.INTEGER },
      altura: { type: Sequelize.INTEGER },
      alt: { type: Sequelize.STRING },
      credito: { type: Sequelize.STRING },
    })

    await queryInterface.createTable('projetos', {
      ...comuns,
      titulo: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(CHAVE), allowNull: false, unique: true },
      resumo: { type: Sequelize.STRING(500), allowNull: false },
      categoria: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'infraestrutura' },
      status: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'concluido' },
      stack: { type: Sequelize.JSON },
      inicio: { type: Sequelize.DATEONLY },
      fim: { type: Sequelize.DATEONLY },
      repositorio: { type: Sequelize.STRING },
      demo: { type: Sequelize.STRING },
      problema: { type: Sequelize.TEXT },
      resultado: { type: Sequelize.TEXT },
      conteudo: { type: Sequelize.TEXT('long') },
      destaque: { type: Sequelize.BOOLEAN, defaultValue: false },
      publicado: { type: Sequelize.BOOLEAN, defaultValue: true },
      capaId: { type: Sequelize.INTEGER },
    })

    await queryInterface.createTable('notas', {
      ...comuns,
      titulo: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(CHAVE), allowNull: false, unique: true },
      resumo: { type: Sequelize.STRING(500), allowNull: false },
      tipo: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'anotacao' },
      publicadoEm: { type: Sequelize.DATEONLY, allowNull: false },
      tags: { type: Sequelize.JSON },
      conteudo: { type: Sequelize.TEXT('long') },
      destaque: { type: Sequelize.BOOLEAN, defaultValue: false },
      publicado: { type: Sequelize.BOOLEAN, defaultValue: true },
    })

    await queryInterface.createTable('certificacoes', {
      ...comuns,
      nome: { type: Sequelize.STRING, allowNull: false },
      emissor: { type: Sequelize.STRING, allowNull: false },
      situacao: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'obtida' },
      emitidaEm: { type: Sequelize.DATEONLY },
      expiraEm: { type: Sequelize.DATEONLY },
      credencialUrl: { type: Sequelize.STRING },
      codigo: { type: Sequelize.STRING },
      descricao: { type: Sequelize.STRING(500) },
      destaque: { type: Sequelize.BOOLEAN, defaultValue: false },
      publicado: { type: Sequelize.BOOLEAN, defaultValue: true },
      logoId: { type: Sequelize.INTEGER },
    })

    await queryInterface.createTable('experiencias', {
      ...comuns,
      cargo: { type: Sequelize.STRING, allowNull: false },
      empresa: { type: Sequelize.STRING, allowNull: false },
      local: { type: Sequelize.STRING },
      vinculo: { type: Sequelize.STRING(40), defaultValue: 'clt' },
      inicio: { type: Sequelize.DATEONLY, allowNull: false },
      fim: { type: Sequelize.DATEONLY },
      atual: { type: Sequelize.BOOLEAN, defaultValue: false },
      descricao: { type: Sequelize.TEXT },
      atividades: { type: Sequelize.JSON },
      tecnologias: { type: Sequelize.JSON },
      publicado: { type: Sequelize.BOOLEAN, defaultValue: true },
    })

    await queryInterface.createTable('habilidades', {
      ...comuns,
      nome: { type: Sequelize.STRING, allowNull: false },
      categoria: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'infraestrutura' },
      nivel: { type: Sequelize.STRING(40), defaultValue: 'intermediario' },
      ordem: { type: Sequelize.INTEGER, defaultValue: 100 },
      publicado: { type: Sequelize.BOOLEAN, defaultValue: true },
    })

    await queryInterface.createTable('perfil', {
      ...comuns,
      nome: { type: Sequelize.STRING, defaultValue: '' },
      headline: { type: Sequelize.STRING, defaultValue: '' },
      bio: { type: Sequelize.TEXT },
      sobre: { type: Sequelize.TEXT('long') },
      promptUsuario: { type: Sequelize.STRING, defaultValue: 'eu@infra' },
      frases: { type: Sequelize.JSON },
      estatisticas: { type: Sequelize.JSON },
      email: { type: Sequelize.STRING },
      localizacao: { type: Sequelize.STRING },
      disponivel: { type: Sequelize.BOOLEAN, defaultValue: true },
      redes: { type: Sequelize.JSON },
      tituloSeo: { type: Sequelize.STRING },
      descricaoSeo: { type: Sequelize.STRING(500) },
      fotoId: { type: Sequelize.INTEGER },
      curriculoId: { type: Sequelize.INTEGER },
    })

    await queryInterface.addIndex('projetos', ['publicado', 'destaque'])
    await queryInterface.addIndex('notas', ['publicado', 'publicadoEm'])
  },

  async down(queryInterface) {
    for (const tabela of [
      'perfil',
      'habilidades',
      'experiencias',
      'certificacoes',
      'notas',
      'projetos',
      'midia',
      'usuarios',
    ]) {
      await queryInterface.dropTable(tabela)
    }
  },
}
