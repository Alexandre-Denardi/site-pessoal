'use strict'

/**
 * As descrições oficiais de certificação (a do Google Workspace, por exemplo)
 * passam de mil caracteres. VARCHAR(500) estourava com
 * "Data too long for column 'descricao'".
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('certificacoes', 'descricao', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('certificacoes', 'descricao', {
      type: Sequelize.STRING(500),
      allowNull: true,
    })
  },
}
