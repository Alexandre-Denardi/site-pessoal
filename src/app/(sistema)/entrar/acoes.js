'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

import { getBd } from '@/bd/conexao'
import { estaBloqueado, limparTentativas, registrarFalha } from '@/lib/limiteTentativas'
import { criarSessao, encerrarSessao } from '@/lib/sessao'

export async function entrar(_anterior, formData) {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const senha = String(formData.get('senha') || '')

  if (!email || !senha) return { erro: 'Informe e-mail e senha.' }

  if (estaBloqueado(email)) {
    return { erro: 'Muitas tentativas com este e-mail. Aguarde alguns minutos e tente de novo.' }
  }

  const bd = await getBd()
  if (!bd) redirect('/instalar')

  const usuario = await bd.modelos.Usuario.findOne({ where: { email } })

  // Mesma mensagem nos dois casos para não revelar quais e-mails existem.
  const confere = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false
  if (!confere) {
    registrarFalha(email)
    return { erro: 'E-mail ou senha incorretos.' }
  }

  limparTentativas(email)
  await criarSessao(usuario)

  redirect('/admin')
}

export async function sair() {
  await encerrarSessao()
  redirect('/entrar')
}
