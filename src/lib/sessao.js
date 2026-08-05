import { cookies } from 'next/headers'

import { getBd } from '@/bd/conexao'
import { NOME_COOKIE, DURACAO_S, criarToken, lerToken } from '@/lib/tokenSessao'

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
