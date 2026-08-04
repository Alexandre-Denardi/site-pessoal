'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

import { configuradoPorEnv, gerarSegredo, gravarConfig, lerConfig } from '@/bd/config'
import { getBd, reiniciarConexao, testarConexao } from '@/bd/conexao'
import { prepararBanco } from '@/bd/migracoes'
import { estadoInstalacao } from '@/lib/estado'
import { criarSessao } from '@/lib/sessao'

/** Passo 1 — validar as credenciais e criar as tabelas. */
export async function configurarBanco(_anterior, formData) {
  if (configuradoPorEnv()) {
    return { erro: 'As credenciais já vêm de variáveis de ambiente — não há o que configurar aqui.' }
  }

  if ((await estadoInstalacao()).etapa === 'pronto') {
    return { erro: 'O site já está instalado.' }
  }

  const cfg = {
    dialect: 'mysql',
    host: String(formData.get('host') || '').trim(),
    port: Number(formData.get('port') || 3306),
    database: String(formData.get('database') || '').trim(),
    username: String(formData.get('username') || '').trim(),
    password: String(formData.get('password') || ''),
  }

  if (!cfg.host || !cfg.database || !cfg.username) {
    return { erro: 'Preencha host, banco e usuário.' }
  }

  const teste = await testarConexao(cfg)
  if (!teste.ok) return { erro: teste.erro, valores: cfg }

  // Segredo usado para assinar o cookie de sessão.
  gravarConfig({ ...cfg, appSecret: lerConfig()?.appSecret || gerarSegredo() })
  await reiniciarConexao()

  try {
    await prepararBanco()
  } catch (erro) {
    return {
      erro: `Conectou, mas falhou ao aplicar as migrations: ${erro?.message ?? erro}`,
      valores: cfg,
    }
  }

  redirect('/instalar')
}

/** Passo 2 — cadastrar o administrador e entrar. */
export async function criarAdministrador(_anterior, formData) {
  const estado = await estadoInstalacao()

  if (estado.etapa === 'sem-banco') return { erro: 'Configure o banco antes.' }
  if (estado.etapa === 'pronto') return { erro: 'Já existe um administrador cadastrado.' }

  const nome = String(formData.get('nome') || '').trim()
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const senha = String(formData.get('senha') || '')
  const confirmar = String(formData.get('confirmar') || '')

  if (!nome || !email) return { erro: 'Preencha nome e e-mail.' }
  if (senha.length < 8) return { erro: 'A senha precisa ter ao menos 8 caracteres.' }
  if (senha !== confirmar) return { erro: 'As senhas não conferem.' }

  const bd = await getBd()
  if (!bd) return { erro: 'Banco indisponível.' }

  const usuario = await bd.modelos.Usuario.create({
    nome,
    email,
    senhaHash: await bcrypt.hash(senha, 12),
  })

  // A linha do perfil já existe (criada junto com as tabelas); só semeia o nome.
  const [perfil] = await bd.modelos.Perfil.findOrCreate({
    where: { id: 1 },
    defaults: { id: 1, nome, promptUsuario: 'eu@infra' },
  })

  if (!perfil.nome) await perfil.update({ nome })

  await criarSessao(usuario)

  redirect('/admin')
}
