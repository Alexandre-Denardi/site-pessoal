import Link from 'next/link'

export function Rodape({ perfil }) {
  const ano = new Date().getFullYear()
  const redes = perfil?.redes ?? []

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono text-xs text-ink-dim">
          <span className="text-verde">$</span> exit — © {ano} {perfil?.nome ?? ''}
        </p>

        <div className="mono flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {redes.map((rede) => (
            <a
              key={rede.url}
              href={rede.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink-dim transition hover:text-verde"
            >
              {rede.rotulo || rede.rede}
            </a>
          ))}
          <Link href="/admin" className="text-ink-dim transition hover:text-verde">
            painel
          </Link>
        </div>
      </div>
    </footer>
  )
}
