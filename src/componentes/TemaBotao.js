'use client'

import { useEffect, useState } from 'react'

export function TemaBotao() {
  const [tema, setTema] = useState('escuro')

  useEffect(() => {
    setTema(document.documentElement.getAttribute('data-tema') || 'escuro')
  }, [])

  const alternar = () => {
    const novo = tema === 'escuro' ? 'claro' : 'escuro'
    document.documentElement.setAttribute('data-tema', novo)
    try {
      localStorage.setItem('tema', novo)
    } catch {
      /* modo privado: só não persiste */
    }
    setTema(novo)
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="mono rounded border border-line px-2.5 py-1.5 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
      aria-label={`Mudar para o tema ${tema === 'escuro' ? 'claro' : 'escuro'}`}
      title="Alternar tema"
    >
      {tema === 'escuro' ? '☾ dark' : '☀ light'}
    </button>
  )
}
