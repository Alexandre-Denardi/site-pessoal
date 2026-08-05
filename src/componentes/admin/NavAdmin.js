'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavAdmin({ itens }) {
  const caminho = usePathname()

  return (
    <nav className="space-y-0.5">
      {itens.map((item) => {
        const ativo =
          item.href === '/admin' ? caminho === '/admin' : caminho.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={`mono block rounded px-3 py-2 text-sm transition ${
              ativo
                ? 'bg-verde/10 text-verde'
                : 'text-ink-dim hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <span className={ativo ? 'text-verde' : 'text-line-forte'}>›</span> {item.rotulo}
          </Link>
        )
      })}
    </nav>
  )
}
