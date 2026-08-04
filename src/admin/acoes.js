'use server'

import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Op } from 'sequelize'

import { getEsquema, CAMPOS_PERFIL } from './esquemas'
import { getBd } from '@/bd/conexao'
import { prepararBanco } from '@/bd/migracoes'
import { mensagemDeErro, validarTamanhos } from '@/lib/erros'
import { usuarioAtual } from '@/lib/sessao'
import { formatSlug } from '@/lib/slug'

const PASTA_MIDIA =
  process.env.MEDIA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'media')

const exigirLogin = async () => {
  const usuario = await usuarioAtual()
  if (!usuario) redirect('/entrar')
  return usuario
}

const conectar = async () => {
  const bd = await getBd()
  if (!bd) redirect('/instalar')
  return bd
}

/** Converte um campo do formulário para o valor que vai ao banco. */
const valorDoCampo = (campo, formData) => {
  const bruto = formData.get(campo.nome)

  switch (campo.tipo) {
    case 'booleano':
      return bruto === 'on' || bruto === 'true'

    case 'numero':
      return bruto === '' || bruto == null ? null : Number(bruto)

    case 'data':
      return bruto ? String(bruto) : null

    case 'midia':
      return bruto ? Number(bruto) : null

    case 'lista':
      return String(bruto ?? '')
        .split('\n')
        .map((linha) => linha.trim())
        .filter(Boolean)

    case 'repetivel':
      try {
        const lista = JSON.parse(String(bruto || '[]'))
        return Array.isArray(lista) ? lista : []
      } catch {
        return []
      }

    default:
      return bruto == null ? null : String(bruto)
  }
}

/** Garante que o slug não colida com outro registro da mesma tabela. */
const slugUnico = async (Modelo, base, idAtual) => {
  let candidato = base
  let n = 2

  for (;;) {
    const onde = { slug: candidato }
    if (idAtual) onde.id = { [Op.ne]: idAtual }

    const existe = await Modelo.findOne({ where: onde, attributes: ['id'] })
    if (!existe) return candidato

    candidato = `${base}-${n}`
    n += 1
  }
}

export async function salvarRegistro(entidade, id, _anterior, formData) {
  await exigirLogin()

  const esquema = getEsquema(entidade)
  if (!esquema) redirect('/admin')

  const bd = await conectar()
  const Modelo = bd.modelos[esquema.modelo]

  const dados = {}
  for (const campo of esquema.campos) {
    dados[campo.nome] = valorDoCampo(campo, formData)
  }

  // Falha aqui devolve o que foi digitado, para nada se perder.
  const excedeu = validarTamanhos(esquema.campos, dados)
  if (excedeu) return { erro: excedeu, valores: dados, tentativa: Date.now() }

  try {
    if (esquema.slugDe) {
      const base = formatSlug(dados.slug || dados[esquema.slugDe] || '')
      dados.slug = await slugUnico(
        Modelo,
        base || `item-${Date.now()}`,
        id === 'novo' ? null : Number(id),
      )
    }

    if (id === 'novo') {
      await Modelo.create(dados)
    } else {
      const registro = await Modelo.findByPk(Number(id))
      if (registro) await registro.update(dados)
    }
  } catch (erro) {
    console.error('[salvarRegistro]', erro?.message ?? erro)
    return { erro: mensagemDeErro(erro, esquema.campos), valores: dados, tentativa: Date.now() }
  }

  revalidatePath('/')
  redirect(`/admin/${entidade}`)
}

export async function excluirRegistro(entidade, id) {
  await exigirLogin()

  const esquema = getEsquema(entidade)
  if (!esquema) redirect('/admin')

  const bd = await conectar()
  await bd.modelos[esquema.modelo].destroy({ where: { id: Number(id) } })

  revalidatePath('/')
  redirect(`/admin/${entidade}`)
}

export async function salvarPerfil(_anterior, formData) {
  await exigirLogin()

  const bd = await conectar()

  const dados = {}
  for (const campo of CAMPOS_PERFIL) {
    dados[campo.nome] = valorDoCampo(campo, formData)
  }

  const excedeu = validarTamanhos(CAMPOS_PERFIL, dados)
  if (excedeu) return { erro: excedeu, valores: dados, tentativa: Date.now() }

  try {
    const [perfil] = await bd.modelos.Perfil.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } })
    await perfil.update(dados)
  } catch (erro) {
    console.error('[salvarPerfil]', erro?.message ?? erro)
    return { erro: mensagemDeErro(erro, CAMPOS_PERFIL), valores: dados, tentativa: Date.now() }
  }

  revalidatePath('/')
  redirect('/admin/perfil?salvo=1')
}

/** Aplica as migrations pendentes no banco. */
export async function sincronizarEstrutura() {
  await exigirLogin()
  await conectar()

  let aplicadas = []

  try {
    aplicadas = await prepararBanco()
  } catch (erro) {
    console.error('[migracoes]', erro?.message ?? erro)
    redirect('/admin?sync=erro')
  }

  revalidatePath('/')
  redirect(`/admin?sync=ok&n=${aplicadas.length}`)
}

export async function enviarMidia(formData) {
  await exigirLogin()

  const arquivo = formData.get('arquivo')
  if (!arquivo || typeof arquivo === 'string' || arquivo.size === 0) {
    redirect('/admin/midia?erro=vazio')
  }

  const bd = await conectar()

  const buffer = Buffer.from(await arquivo.arrayBuffer())
  const extensao = (path.extname(arquivo.name) || '').toLowerCase().slice(0, 10)
  const nomeDisco = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extensao}`

  await fs.mkdir(/*turbopackIgnore: true*/ PASTA_MIDIA, { recursive: true })
  await fs.writeFile(/*turbopackIgnore: true*/ path.join(PASTA_MIDIA, nomeDisco), buffer)

  let largura = null
  let altura = null

  if (arquivo.type?.startsWith('image/')) {
    try {
      const sharp = (await import('sharp')).default
      const meta = await sharp(buffer).metadata()
      largura = meta.width ?? null
      altura = meta.height ?? null
    } catch {
      /* segue sem dimensões */
    }
  }

  await bd.modelos.Midia.create({
    arquivo: nomeDisco,
    nomeOriginal: arquivo.name,
    mime: arquivo.type,
    tamanho: arquivo.size,
    largura,
    altura,
    alt: String(formData.get('alt') || ''),
  })

  revalidatePath('/')
  redirect('/admin/midia')
}

export async function excluirMidia(id) {
  await exigirLogin()

  const bd = await conectar()
  const registro = await bd.modelos.Midia.findByPk(Number(id))

  if (registro) {
    await fs
      .unlink(/*turbopackIgnore: true*/ path.join(PASTA_MIDIA, registro.arquivo))
      .catch(() => {})
    await registro.destroy()
  }

  revalidatePath('/')
  redirect('/admin/midia')
}
