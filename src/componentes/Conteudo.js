import { paraHtml } from '@/lib/markdown'

/** Renderiza o Markdown escrito no painel com a tipografia do tema. */
export function Conteudo({ texto, className = '' }) {
  if (!texto) return null

  return (
    <div
      className={`prosa ${className}`}
      dangerouslySetInnerHTML={{ __html: paraHtml(texto) }}
    />
  )
}
