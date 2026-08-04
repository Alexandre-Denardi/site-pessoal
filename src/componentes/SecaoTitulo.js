/**
 * Cabeçalho de seção no formato de comando de terminal:
 *   $ cat experiencia.md
 */
export function SecaoTitulo({ comando, titulo, descricao, id }) {
  return (
    <header className="mb-8" id={id}>
      <p className="mono mb-3 text-sm text-ink-dim">
        <span className="text-verde">$</span> {comando}
      </p>
      <h2 className="mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{titulo}</h2>
      {descricao ? <p className="mt-2 max-w-2xl text-ink-dim">{descricao}</p> : null}
    </header>
  )
}
