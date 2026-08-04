import Link from 'next/link'

import { Etiqueta } from './Etiqueta'
import { ROTULO_TIPO_NOTA, dataCurta } from '@/lib/formato'

export function CartaoNota({ nota }) {
  return (
    <article className="cartao brilho-hover group flex h-full flex-col p-5">
      <div className="mb-3 flex items-center gap-2">
        <Etiqueta variante="verde">{ROTULO_TIPO_NOTA[nota.tipo] ?? nota.tipo}</Etiqueta>
        <span className="mono text-xs text-ink-dim">{dataCurta(nota.publicadoEm)}</span>
      </div>

      <h3 className="mono text-lg leading-snug font-semibold text-ink">
        <Link href={`/notas/${nota.slug}`} className="before:absolute before:inset-0">
          {nota.titulo}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{nota.resumo}</p>

      {nota.tags?.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {nota.tags.slice(0, 5).map((tag) => (
            <li key={tag}>
              <Etiqueta>#{tag}</Etiqueta>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
