'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

import { getBd } from '@/bd/conexao'
import { criarSessao, encerrarSessao } from '@/lib/sessao'

export async function entrar(_anterior, formData) {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const senha = String(formData.get('senha') || '')

  if (!email || !senha) return { erro: 'Informe e-mail e senha.' }

  const bd = await getBd()
  if (!bd) redirect('/instalar')

  const usuario = await bd.modelos.Usuario.findOne({ where: { email } })

  // Mesma mensagem nos dois casos para não revelar quais e-mails existem.
  const confere = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false
  if (!confere) return { erro: 'E-mail ou senha incorretos.' }

  await criarSessao(usuario)

  redirect('/admin')
}

export async function sair() {
  await encerrarSessao()
  redirect('/entrar')
}
