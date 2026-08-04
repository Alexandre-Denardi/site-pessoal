import Link from 'next/link'

import { sincronizarEstrutura } from '@/admin/acoes'
import { ESQUEMAS } from '@/admin/esquemas'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'
import { getBd } from '@/bd/conexao'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Painel' }

export default async function PainelInicio({ searchParams }) {
  const { sync } = await searchParams
  const bd = await getBd()

  const contagens = await Promise.all(
    Object.entries(ESQUEMAS).map(async ([chave, esquema]) => {
      let total = 0
      try {
        total = await bd.modelos[esquema.modelo].count()
      } catch {
        /* tabela ainda vazia */
      }
      return { chave, plural: esquema.plural, total }
    }),
  )

  return (
    <>
      <SecaoTitulo
        comando="status"
        titulo="Painel"
        descricao="O que está publicado no site agora."
      />

      {sync === 'ok' ? (
        <p className="mono mb-5 rounded border border-verde-esc/60 bg-verde/10 px-3 py-2.5 text-xs text-verde">
          ✓ estrutura do banco sincronizada
        </p>
      ) : null}

      {sync === 'erro' ? (
        <p className="mono mb-5 rounded border border-vermelho/50 bg-vermelho/10 px-3 py-2.5 text-xs text-vermelho">
          ✗ falha ao sincronizar — veja os logs da aplicação
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contagens.map((item) => (
          <Link key={item.chave} href={`/admin/${item.chave}`} className="cartao brilho-hover p-5">
            <p className="mono text-xs text-ink-dim">{item.plural.toLowerCase()}</p>
            <p className="mono mt-1 text-3xl font-semibold text-verde">{item.total}</p>
          </Link>
        ))}
      </div>

      <div className="cartao mt-6 p-5">
        <p className="mono mb-3 text-sm text-verde">atalhos</p>
        <div className="mono flex flex-wrap gap-2 text-xs">
          <Link
            href="/admin/projetos/novo"
            className="rounded border border-line px-3 py-1.5 text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            + novo projeto
          </Link>
          <Link
            href="/admin/notas/novo"
            className="rounded border border-line px-3 py-1.5 text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            + nova nota
          </Link>
          <Link
            href="/admin/certificacoes/novo"
            className="rounded border border-line px-3 py-1.5 text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            + nova certificação
          </Link>
          <Link
            href="/admin/perfil"
            className="rounded border border-line px-3 py-1.5 text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            editar perfil
          </Link>
        </div>
      </div>

      <div className="cartao mt-4 p-5">
        <p className="mono mb-2 text-sm text-verde">manutenção</p>
        <p className="mb-3 text-sm leading-relaxed text-ink-dim">
          Depois de mexer em <code className="mono text-verde">src/bd/modelos.js</code>, use isto
          para criar as colunas novas e aplicar mudanças de tipo no MySQL. Não apaga dados.
        </p>
        <form action={sincronizarEstrutura}>
          <button
            type="submit"
            className="mono rounded border border-line px-3 py-1.5 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            sincronizar estrutura do banco
          </button>
        </form>
      </div>
    </>
  )
}
