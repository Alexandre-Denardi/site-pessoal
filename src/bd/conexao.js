import { Sequelize } from 'sequelize'

import { lerConfig } from './config.js'
import { definirModelos } from './modelos.js'

/**
 * Em dev o Next recarrega os módulos a cada alteração; sem este cache
 * global abriríamos um pool novo de conexões a cada hot reload.
 */
const cache = (globalThis.__bdSite ??= { conexao: null, chave: null })

const chaveDe = (cfg) =>
  cfg.dialect === 'sqlite'
    ? `sqlite:${cfg.storage}`
    : `${cfg.dialect}://${cfg.username}@${cfg.host}:${cfg.port}/${cfg.database}`

/** Cria a instância do Sequelize a partir das credenciais. */
export function criarSequelize(cfg) {
  // sqlite existe só para desenvolver sem subir banco; produção é MySQL.
  if (cfg.dialect === 'sqlite') {
    return new Sequelize({
      dialect: 'sqlite',
      storage: cfg.storage || './data/site.sqlite',
      logging: false,
    })
  }

  return new Sequelize(cfg.database, cfg.username, cfg.password, {
    host: cfg.host,
    port: Number(cfg.port) || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
    pool: { max: 5, min: 0, acquire: 15000, idle: 10000 },
    dialectOptions: { connectTimeout: 15000 },
  })
}

/**
 * Testa credenciais sem tocar no estado da aplicação.
 * @returns {Promise<{ok: true} | {ok: false, erro: string}>}
 */
export async function testarConexao(cfg) {
  let sequelize

  try {
    sequelize = criarSequelize(cfg)
    await sequelize.authenticate()
    return { ok: true }
  } catch (erro) {
    return { ok: false, erro: traduzirErro(erro) }
  } finally {
    if (sequelize) await sequelize.close().catch(() => {})
  }
}

const traduzirErro = (erro) => {
  const msg = erro?.original?.message || erro?.message || String(erro)
  const codigo = erro?.original?.code

  if (codigo === 'ER_ACCESS_DENIED_ERROR') return 'Usuário ou senha incorretos.'
  if (codigo === 'ER_BAD_DB_ERROR') return 'O banco informado não existe nesse servidor.'
  if (codigo === 'ENOTFOUND') return 'Host não encontrado — confira o endereço.'
  if (codigo === 'ECONNREFUSED') return 'Conexão recusada — o servidor não respondeu nessa porta.'
  if (codigo === 'ETIMEDOUT') return 'Tempo esgotado — verifique se o banco aceita conexões deste app.'

  return msg
}

/**
 * Conexão em uso + modelos. Retorna null se o site ainda não foi instalado.
 * @returns {Promise<{sequelize: import('sequelize').Sequelize, modelos: ReturnType<typeof definirModelos>} | null>}
 */
export async function getBd() {
  const cfg = lerConfig()
  if (!cfg) return null

  const chave = chaveDe(cfg)

  if (cache.conexao && cache.chave === chave) return cache.conexao

  if (cache.conexao) await cache.conexao.sequelize.close().catch(() => {})

  const sequelize = criarSequelize(cfg)
  const modelos = definirModelos(sequelize)

  cache.conexao = { sequelize, modelos }
  cache.chave = chave

  return cache.conexao
}

/** Descarta a conexão em cache (usado depois de reconfigurar o banco). */
export async function reiniciarConexao() {
  if (cache.conexao) await cache.conexao.sequelize.close().catch(() => {})
  cache.conexao = null
  cache.chave = null
}
