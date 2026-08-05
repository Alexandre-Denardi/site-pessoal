'use strict'

/** Favicon do site, gerenciável pelo painel — mesma ideia de foto/currículo. */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('perfil', 'faviconId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('perfil', 'faviconId')
  },
}
