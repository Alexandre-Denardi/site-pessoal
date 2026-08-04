import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Conteudo } from '@/componentes/Conteudo'
import { Etiqueta } from '@/componentes/Etiqueta'
import { getNota } from '@/lib/dados'
import { ROTULO_TIPO_NOTA, dataCurta } from '@/lib/formato'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const nota = await getNota(slug)

  if (!nota) return { title: 'Nota não encontrada' }

  return {
    title: nota.titulo,
    description: nota.resumo,
    openGraph: {
      title: nota.titulo,
      description: nota.resumo,
      type: 'article',
      publishedTime: nota.publicadoEm,
    },
  }
}

export default async function PaginaNota({ params }) {
  const { slug } = await params
  const nota = await getNota(slug)

  if (!nota) notFound()

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p className="mono mb-6 text-sm text-ink-dim">
        <Link href="/notas" className="hover:text-verde">
          cd ..
        </Link>
        <span className="mx-2 text-line-forte">|</span>
        <span className="text-verde">~/notas/</span>
        {nota.slug}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Etiqueta variante="verde">{ROTULO_TIPO_NOTA[nota.tipo] ?? nota.tipo}</Etiqueta>
        <span className="mono text-xs text-ink-dim">{dataCurta(nota.publicadoEm)}</span>
      </div>

      <h1 className="mono text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl">
        {nota.titulo}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-ink-dim">{nota.resumo}</p>

      {nota.tags?.length ? (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {nota.tags.map((tag) => (
            <li key={tag}>
              <Etiqueta>#{tag}</Etiqueta>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-10 border-t border-line pt-10">
        <Conteudo texto={nota.conteudo} />
      </div>

      <p className="mono mt-14 text-sm">
        <Link href="/notas" className="text-verde hover:underline">
          ← voltar para as notas
        </Link>
      </p>
    </article>
  )
}
