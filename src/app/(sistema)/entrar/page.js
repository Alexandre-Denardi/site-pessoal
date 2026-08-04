import Link from 'next/link'
import { redirect } from 'next/navigation'

import { FormularioEntrar } from './Formulario'
import { Janela } from '@/componentes/Janela'
import { estadoInstalacao } from '@/lib/estado'
import { usuarioAtual } from '@/lib/sessao'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Entrar' }

export default async function PaginaEntrar() {
  const estado = await estadoInstalacao()
  if (estado.etapa !== 'pronto') redirect('/instalar')

  if (await usuarioAtual()) redirect('/admin')

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-14">
      <p className="mono mb-4 text-sm text-ink-dim">
        <span className="text-verde">$</span> sudo su
      </p>

      <Janela titulo="autenticação" className="scanlines" corpoClassName="p-6 sm:p-8">
        <h1 className="mono text-xl font-semibold text-ink">Entrar no painel</h1>
        <p className="mt-2 mb-6 text-sm text-ink-dim">Acesso restrito ao administrador do site.</p>

        <FormularioEntrar />
      </Janela>

      <p className="mono mt-6 text-center text-xs">
        <Link href="/" className="text-ink-dim transition hover:text-verde">
          ← voltar ao site
        </Link>
      </p>
    </div>
  )
}
