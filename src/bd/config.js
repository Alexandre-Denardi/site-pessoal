import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

/**
 * Credenciais do banco.
 *
 * Duas origens, nesta ordem de prioridade:
 *  1. variáveis de ambiente (DB_HOST, DB_NAME, …) — o instalador nem aparece
 *  2. arquivo data/config.json, gravado pelo instalador no primeiro acesso
 */
const ARQUIVO =
  process.env.CONFIG_FILE || path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'config.json')

const porEnv = () => {
  if (!process.env.DB_HOST && !process.env.DB_NAME) return null

  return {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS ?? '',
    storage: process.env.DB_STORAGE || './data/site.sqlite',
    appSecret: process.env.APP_SECRET,
    origem: 'env',
  }
}

const porArquivo = () => {
  try {
    return {
      ...JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ ARQUIVO, 'utf8')),
      origem: 'arquivo',
    }
  } catch {
    return null
  }
}

/** Config em uso, ou null se o site ainda não foi instalado. */
export const lerConfig = () => porEnv() ?? porArquivo()

/** True quando as credenciais vêm do ambiente — instalador fica bloqueado. */
export const configuradoPorEnv = () => Boolean(porEnv())

export const gravarConfig = (dados) => {
  fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(ARQUIVO), { recursive: true })
  fs.writeFileSync(/*turbopackIgnore: true*/ ARQUIVO, JSON.stringify(dados, null, 2), {
    encoding: 'utf8',
    mode: 0o600,
  })
}

export const apagarConfig = () => {
  try {
    fs.unlinkSync(/*turbopackIgnore: true*/ ARQUIVO)
  } catch {
    /* já não existe */
  }
}

export const gerarSegredo = () => crypto.randomBytes(32).toString('hex')

export const caminhoConfig = () => ARQUIVO
