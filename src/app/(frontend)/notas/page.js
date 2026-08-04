import { CartaoNota } from '@/componentes/CartaoNota'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'
import { listarNotas } from '@/lib/dados'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notas & ideias',
  description: 'Anotações técnicas, runbooks, post-mortems e ideias em desenvolvimento.',
}

export default async function PaginaNotas() {
  const notas = await listarNotas({ limite: 200 })

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <SecaoTitulo
        comando="ls -lt ~/notas"
        titulo="Notas & ideias"
        descricao="Documentação aberta: o que aprendi, o que quebrei e como consertei."
      />

      {notas.length === 0 ? (
        <p className="mono text-sm text-ink-dim">
          nenhuma nota publicada ainda — escreva a primeira em{' '}
          <a href="/admin" className="text-verde hover:underline">
            /admin
          </a>
          .
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notas.map((nota) => (
            <CartaoNota key={nota.id} nota={nota} />
          ))}
        </div>
      )}
    </div>
  )
}
