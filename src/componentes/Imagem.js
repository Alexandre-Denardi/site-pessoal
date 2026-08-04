/**
 * Renderiza um arquivo enviado pelo painel.
 * Usa <img> puro de propósito: a rota /midia já serve com cache imutável e
 * assim não gastamos CPU/RAM do container otimizando imagem a cada acesso.
 */
export function Imagem({ midia, className = '', alt, ...resto }) {
  if (!midia?.arquivo) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/midia/${midia.arquivo}`}
      alt={alt ?? midia.alt ?? ''}
      width={midia.largura ?? undefined}
      height={midia.altura ?? undefined}
      loading="lazy"
      decoding="async"
      className={className}
      {...resto}
    />
  )
}
