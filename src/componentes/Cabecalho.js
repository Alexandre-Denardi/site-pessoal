'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { TemaBotao } from './TemaBotao'

const LINKS = [
  { href: '/', rotulo: 'início' },
  { href: '/projetos', rotulo: 'projetos' },
  { href: '/notas', rotulo: 'notas' },
  { href: '/#contato', rotulo: 'contato' },
]

export function Cabecalho({ prompt = 'visitante@site' }) {
  const [aberto, setAberto] = useState(false)
  const caminho = usePathname()

  const ativo = (href) =>
    href === '/' ? caminho === '/' : caminho.startsWith(href.replace('/#contato', '/nunca'))

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="mono group flex items-center gap-2 text-sm">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-vermelho/70" />
            <span className="size-2.5 rounded-full bg-ambar/70" />
            <span className="size-2.5 rounded-full bg-verde/70" />
          </span>
          <span className="text-ink-dim transition group-hover:text-ink">
            {prompt}
            <span className="text-verde">:~$</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mono rounded px-2.5 py-1.5 text-sm transition hover:bg-surface-2 hover:text-verde ${
                ativo(link.href) ? 'text-verde' : 'text-ink-dim'
              }`}
            >
              {link.rotulo}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          <TemaBotao />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <TemaBotao />
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-label="Abrir menu"
            className="mono rounded border border-line px-2.5 py-1.5 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
          >
            {aberto ? '[ x ]' : '[ ≡ ]'}
          </button>
        </div>
      </div>

      {aberto ? (
        <nav className="border-t border-line bg-surface px-5 py-2 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAberto(false)}
              className="mono block py-2.5 text-sm text-ink-dim transition hover:text-verde"
            >
              <span className="text-verde">›</span> {link.rotulo}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
