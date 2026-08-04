import Link from 'next/link'

import { Janela } from '@/componentes/Janela'

export const metadata = { title: '404 — não encontrado' }

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <Janela titulo="erro" corpoClassName="p-8">
        <p className="mono text-sm text-ink-dim">
          <span className="text-verde">$</span> cat {'{caminho}'}
        </p>
        <p className="mono mt-3 text-vermelho">
          cat: caminho inexistente: Arquivo ou diretório não encontrado
        </p>
        <h1 className="mono mt-6 text-4xl font-bold text-ink">404</h1>
        <p className="mt-3 text-ink-dim">Essa página não existe (ou foi despublicada).</p>
        <p className="mono mt-8 text-sm">
          <Link href="/" className="text-verde hover:underline">
            cd ~ &nbsp;← voltar para o início
          </Link>
        </p>
      </Janela>
    </div>
  )
}
