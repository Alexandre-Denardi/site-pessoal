import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: false,
})

/**
 * Converte o Markdown escrito no painel em HTML.
 * O conteúdo vem apenas de usuários autenticados do próprio painel.
 * @param {string | null | undefined} texto
 * @returns {string}
 */
export const paraHtml = (texto) => {
  if (!texto || typeof texto !== 'string') return ''
  return marked.parse(texto)
}

/** Primeiras palavras do Markdown, sem marcação — útil para resumos. */
export const trecho = (texto, limite = 180) => {
  if (!texto) return ''

  const limpo = texto
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  return limpo.length > limite ? `${limpo.slice(0, limite)}…` : limpo
}
