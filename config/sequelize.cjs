/**
 * Config para o sequelize-cli (usado só para gerar arquivos de migration).
 * Lê as mesmas credenciais da aplicação: variáveis DB_* ou data/config.json.
 */
const fs = require('fs')
const path = require('path')

const doArquivo = () => {
  try {
    const caminho = process.env.CONFIG_FILE || path.join(process.cwd(), 'data', 'config.json')
    return JSON.parse(fs.readFileSync(caminho, 'utf8'))
  } catch {
    return {}
  }
}

const salvo = doArquivo()

const config = {
  dialect: process.env.DB_DIALECT || salvo.dialect || 'mysql',
  host: process.env.DB_HOST || salvo.host,
  port: Number(process.env.DB_PORT || salvo.port || 3306),
  database: process.env.DB_NAME || salvo.database,
  username: process.env.DB_USER || salvo.username,
  password: process.env.DB_PASS ?? salvo.password ?? '',
  storage: process.env.DB_STORAGE || salvo.storage || './data/site.sqlite',
  logging: false,
}

module.exports = {
  development: config,
  production: config,
}
