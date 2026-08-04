'use client'

import { useMemo, useState } from 'react'

import { CartaoProjeto } from './CartaoProjeto'
import { ROTULO_CATEGORIA } from '@/lib/formato'

export function FiltroProjetos({ projetos }) {
  const [filtro, setFiltro] = useState('todos')

  const categorias = useMemo(() => {
    const presentes = [...new Set(projetos.map((p) => p.categoria))]
    return ['todos', ...presentes]
  }, [projetos])

  const visiveis = useMemo(
    () => (filtro === 'todos' ? projetos : projetos.filter((p) => p.categoria === filtro)),
    [filtro, projetos],
  )

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoria">
        <span className="mono mr-1 text-xs text-ink-dim">
          <span className="text-verde">grep</span> --categoria
        </span>
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFiltro(cat)}
            aria-pressed={filtro === cat}
            className={`mono rounded border px-2.5 py-1 text-xs transition ${
              filtro === cat
                ? 'border-verde-esc bg-verde/10 text-verde'
                : 'border-line text-ink-dim hover:border-verde-esc/60 hover:text-ink'
            }`}
          >
            {cat === 'todos' ? 'todos' : (ROTULO_CATEGORIA[cat] ?? cat)}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p className="mono text-sm text-ink-dim">nenhum projeto nessa categoria.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {visiveis.map((projeto) => (
            <CartaoProjeto key={projeto.id} projeto={projeto} />
          ))}
        </div>
      )}
    </>
  )
}
