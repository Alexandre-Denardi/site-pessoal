import crypto from 'crypto'

import { lerConfig } from '@/bd/config'

export const NOME_COOKIE = 'sessao'
export const DURACAO_S = 60 * 60 * 8

const segredo = () => process.env.APP_SECRET || lerConfig()?.appSecret || 'segredo-de-desenvolvimento'

const b64 = (texto) => Buffer.from(texto).toString('base64url')
const deB64 = (texto) => Buffer.from(texto, 'base64url').toString('utf8')

const assinar = (dados) => crypto.createHmac('sha256', segredo()).update(dados).digest('base64url')

/** Gera o token assinado que vai no cookie. */
export const criarToken = (payload) => {
  const corpo = b64(JSON.stringify(payload))
  return `${corpo}.${assinar(corpo)}`
}

/**
 * Confere assinatura e validade do token — não confere se o usuário ainda
 * existe no banco (por isso não depende de conexão nenhuma). Quem precisa
 * dessa garantia extra usa `usuarioAtual()` em sessao.js.
 */
export const lerToken = (token) => {
  if (typeof token !== 'string' || !token.includes('.')) return null

  const [corpo, assinatura] = token.split('.')
  const esperada = assinar(corpo)

  // Comparação em tempo constante evita vazar a assinatura por timing.
  const a = Buffer.from(assinatura)
  const b = Buffer.from(esperada)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(deB64(corpo))
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
