import Link from 'next/link'
import { redirect } from 'next/navigation'

import { sair } from '../entrar/acoes'
import { ENTIDADES } from '@/admin/esquemas'
import { NavAdmin } from '@/componentes/admin/NavAdmin'
import { TemaBotao } from '@/componentes/TemaBotao'
import { estadoInstalacao } from '@/lib/estado'
import { usuarioAtual } from '@/lib/sessao'

export const dynamic = 'force-dynamic'

export default async function LayoutAdmin({ children }) {
  const estado = await estadoInstalacao()
  if (estado.etapa !== 'pronto') redirect('/instalar')

  const usuario = await usuarioAtual()
  if (!usuario) redirect('/entrar')

  const itens = [
    { href: '/admin', rotulo: 'painel' },
    ...ENTIDADES.map((e) => ({ href: `/admin/${e.chave}`, rotulo: e.plural.toLowerCase() })),
    { href: '/admin/perfil', rotulo: 'perfil & contato' },
    { href: '/admin/midia', rotulo: 'mídia' },
  ]

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/admin" className="mono flex items-center gap-2 text-sm">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-vermelho/70" />
              <span className="size-2.5 rounded-full bg-ambar/70" />
              <span className="size-2.5 rounded-full bg-verde/70" />
            </span>
            <span className="text-ink-dim">
              {usuario.nome}
              <span className="text-verde">@painel:~#</span>
            </span>
          </Link>

          <div className="mono flex items-center gap-3 text-xs">
            <Link href="/" target="_blank" className="text-ink-dim transition hover:text-verde">
              ver site ↗
            </Link>
            <TemaBotao />
            <form action={sair}>
              <button
                type="submit"
                className="mono rounded border border-line px-2.5 py-1.5 text-xs text-ink-dim transition hover:border-vermelho hover:text-vermelho"
              >
                sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <NavAdmin itens={itens} />
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
