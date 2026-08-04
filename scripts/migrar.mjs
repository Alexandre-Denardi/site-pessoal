#!/usr/bin/env node
/**
 * Migrations pela linha de comando.
 *
 *   npm run db:migrate           aplica as pendentes
 *   npm run db:migrate:status    lista aplicadas e pendentes
 *   npm run db:migrate:undo      desfaz a última
 *
 * Usa as mesmas credenciais do site: variáveis DB_* ou data/config.json.
 */
import { getBd } from '../src/bd/conexao.js'
import { aplicarMigracoes, desfazerUltima, statusMigracoes } from '../src/bd/migracoes.js'

const comando = process.argv[2] || 'up'

const bd = await getBd()

if (!bd) {
  console.error(
    'Banco não configurado. Defina as variáveis DB_* no .env ou rode o instalador em /instalar.',
  )
  process.exit(1)
}

try {
  if (comando === 'up') {
    const aplicadas = await aplicarMigracoes(bd.sequelize)
    console.log(
      aplicadas.length ? `Aplicadas: ${aplicadas.join(', ')}` : 'Nada pendente — banco em dia.',
    )
  } else if (comando === 'undo') {
    const desfeitas = await desfazerUltima(bd.sequelize)
    console.log(desfeitas.length ? `Desfeita: ${desfeitas.join(', ')}` : 'Nada a desfazer.')
  } else if (comando === 'status') {
    const { aplicadas, pendentes } = await statusMigracoes(bd.sequelize)
    console.log('aplicadas:', aplicadas.length ? aplicadas.join(', ') : '(nenhuma)')
    console.log('pendentes:', pendentes.length ? pendentes.join(', ') : '(nenhuma)')
  } else {
    console.error(`Comando desconhecido: ${comando}. Use up, undo ou status.`)
    process.exitCode = 1
  }
} catch (erro) {
  console.error('Falhou:', erro?.message ?? erro)
  process.exitCode = 1
} finally {
  await bd.sequelize.close().catch(() => {})
}
