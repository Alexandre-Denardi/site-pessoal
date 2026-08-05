'use strict'

/**
 * O arquivo enviado pelo painel passa a ficar dentro do próprio banco
 * (LONGBLOB), não mais em media/ dentro do container. Assim ele sobrevive a
 * redeploy igual o resto do conteúdo — hoje o MySQL já é a única fonte de
 * verdade do site, e o arquivo era a exceção que ficava só no disco.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('midia', 'dados', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('midia', 'dados')
  },
}
