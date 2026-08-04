import crypto from 'crypto'
import { cookies } from 'next/headers'

import { lerConfig } from '@/bd/config'
import { getBd } from '@/bd/conexao'

const NOME_COOKIE = 'sessao'
const DURACAO_S = 60 * 60 * 8

const segredo = () => process.env.APP_SECRET || lerConfig()?.appSecret || 'segredo-de-desenvolvimento'

const b64 = (texto) => Buffer.from(texto).toString('base64url')
const deB64 = (texto) => Buffer.from(texto, 'base64url').toString('utf8')

const assinar = (dados) =>
  crypto.createHmac('sha256', segredo()).update(dados).digest('base64url')

/** Gera o token assinado que vai no cookie. */
const criarToken = (payload) => {
  const corpo = b64(JSON.stringify(payload))
  return `${corpo}.${assinar(corpo)}`
}

const lerToken = (token) => {
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

export async function criarSessao(usuario) {
  const token = criarToken({
    id: usuario.id,
    nome: usuario.nome,
    exp: Date.now() + DURACAO_S * 1000,
  })

  const jar = await cookies()
  jar.set(NOME_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURACAO_S,
  })
}

export async function encerrarSessao() {
  const jar = await cookies()
  jar.delete(NOME_COOKIE)
}

/** Usuário logado, ou null. Confere que ele ainda existe no banco. */
export async function usuarioAtual() {
  const jar = await cookies()
  const payload = lerToken(jar.get(NOME_COOKIE)?.value)
  if (!payload) return null

  try {
    const bd = await getBd()
    if (!bd) return null

    const usuario = await bd.modelos.Usuario.findByPk(payload.id, {
      attributes: ['id', 'nome', 'email'],
    })

    return usuario ? usuario.get({ plain: true }) : null
  } catch {
    return null
  }
}
