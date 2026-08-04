const VARIANTES = {
  neutra: 'border-line text-ink-dim',
  verde: 'border-verde-esc/60 text-verde bg-verde/5',
  ambar: 'border-ambar/50 text-ambar bg-ambar/5',
  vermelha: 'border-vermelho/50 text-vermelho bg-vermelho/5',
}

export function Etiqueta({ children, variante = 'neutra', className = '' }) {
  return (
    <span
      className={`mono inline-flex items-center rounded border px-2 py-0.5 text-[0.7rem] leading-5 ${VARIANTES[variante] ?? VARIANTES.neutra} ${className}`}
    >
      {children}
    </span>
  )
}
