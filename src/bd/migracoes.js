import { createRequire } from 'module'
import path from 'path'

import { Sequelize } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'

import { getBd } from './conexao.js'

// As migrations ficam fora de src/ e são carregadas em tempo de execução —
// por isso o require dinâmico em vez de import estático.
const exigir = createRequire(path.join(/*turbopackIgnore: true*/ process.cwd(), 'package.json'))

const PASTA =
  process.env.MIGRATIONS_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'migrations')

const PRIMEIRA = '001-estrutura-inicial.cjs'

/** Monta o Umzug com os arquivos de migration no formato do sequelize-cli. */
export function criarUmzug(sequelize) {
  return new Umzug({
    migrations: {
      glob: ['*.cjs', { cwd: PASTA }],
      resolve: ({ name, path: caminho, context }) => {
        const migracao = exigir(caminho)

        return {
          name,
          up: async () => migracao.up(context, Sequelize),
          down: async () => migracao.down(context, Sequelize),
        }
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  })
}

/** O banco já tem as tabelas do site? (indica instalação anterior às migrations) */
async function jaTemEstrutura(sequelize) {
  try {
    const tabelas = await sequelize.getQueryInterface().showAllTables()
    return tabelas
      .map((t) => (typeof t === 'string' ? t : t.tableName))
      .some((t) => String(t).toLowerCase() === 'usuarios')
  } catch {
    return false
  }
}

/**
 * Aplica as migrations pendentes.
 *
 * Se encontrar um banco montado antes das migrations existirem (criado pelo
 * sync antigo), registra a estrutura inicial como já aplicada e segue das
 * seguintes em diante — sem tentar recriar tabela que já existe.
 */
export async function aplicarMigracoes(sequelize) {
  const umzug = criarUmzug(sequelize)

  const executadas = await umzug.executed()

  if (executadas.length === 0 && (await jaTemEstrutura(sequelize))) {
    console.log('[migracoes] banco pré-existente detectado — marcando %s como aplicada', PRIMEIRA)
    await new SequelizeStorage({ sequelize }).logMigration({ name: PRIMEIRA })
  }

  const aplicadas = await umzug.up()

  return aplicadas.map((m) => m.name)
}

export async function desfazerUltima(sequelize) {
  const desfeitas = await criarUmzug(sequelize).down()
  return desfeitas.map((m) => m.name)
}

export async function statusMigracoes(sequelize) {
  const umzug = criarUmzug(sequelize)

  return {
    aplicadas: (await umzug.executed()).map((m) => m.name),
    pendentes: (await umzug.pending()).map((m) => m.name),
  }
}

/**
 * Deixa o banco pronto para uso: migrations em dia + a linha única do perfil.
 * Usado pelo instalador e pelo botão de manutenção do painel.
 */
export async function prepararBanco() {
  const bd = await getBd()
  if (!bd) throw new Error('Banco não configurado.')

  const aplicadas = await aplicarMigracoes(bd.sequelize)

  await bd.modelos.Perfil.findOrCreate({
    where: { id: 1 },
    defaults: { id: 1, nome: '', headline: '' },
  })

  return aplicadas
}
