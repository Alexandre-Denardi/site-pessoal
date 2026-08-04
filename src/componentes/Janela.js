/** Moldura de janela de terminal, com barra de título e os três pontos. */
export function Janela({ titulo = 'bash', children, className = '', corpoClassName = '' }) {
  return (
    <div className={`janela ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-vermelho/70" />
          <span className="size-2.5 rounded-full bg-ambar/70" />
          <span className="size-2.5 rounded-full bg-verde/70" />
        </span>
        <span className="mono truncate text-xs text-ink-dim">{titulo}</span>
      </div>
      <div className={corpoClassName}>{children}</div>
    </div>
  )
}
