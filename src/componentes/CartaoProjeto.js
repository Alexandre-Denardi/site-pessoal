import Link from 'next/link'

import { Etiqueta } from './Etiqueta'
import { Imagem } from './Imagem'
import { ROTULO_CATEGORIA, ROTULO_STATUS, periodo } from '@/lib/formato'

const VARIANTE_STATUS = {
  concluido: 'verde',
  'em-andamento': 'ambar',
  manutencao: 'ambar',
  descontinuado: 'neutra',
}

export function CartaoProjeto({ projeto }) {
  const quando = periodo(projeto.inicio, projeto.fim)

  return (
    <article className="cartao brilho-hover group flex h-full flex-col overflow-hidden">
      {projeto.capa ? (
        <Imagem
          midia={projeto.capa}
          alt={projeto.capa.alt || projeto.titulo}
          className="h-40 w-full border-b border-line object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Etiqueta variante="verde">
            {ROTULO_CATEGORIA[projeto.categoria] ?? projeto.categoria}
          </Etiqueta>
          <Etiqueta variante={VARIANTE_STATUS[projeto.status] ?? 'neutra'}>
            {ROTULO_STATUS[projeto.status] ?? projeto.status}
          </Etiqueta>
        </div>

        <h3 className="mono text-lg leading-snug font-semibold text-ink">
          <Link href={`/projetos/${projeto.slug}`} className="before:absolute before:inset-0">
            {projeto.titulo}
          </Link>
        </h3>

        {quando ? <p className="mono mt-1 text-xs text-ink-dim">{quando}</p> : null}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{projeto.resumo}</p>

        {projeto.stack?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {projeto.stack.slice(0, 5).map((item) => (
              <li key={item}>
                <Etiqueta>{item}</Etiqueta>
              </li>
            ))}
            {projeto.stack.length > 5 ? (
              <li>
                <Etiqueta>+{projeto.stack.length - 5}</Etiqueta>
              </li>
            ) : null}
          </ul>
        ) : null}

        <p className="mono mt-4 text-xs text-verde opacity-0 transition group-hover:opacity-100">
          abrir →
        </p>
      </div>
    </article>
  )
}
