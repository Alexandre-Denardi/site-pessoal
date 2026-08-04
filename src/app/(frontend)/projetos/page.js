import { FiltroProjetos } from '@/componentes/FiltroProjetos'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'
import { listarProjetos } from '@/lib/dados'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projetos',
  description: 'Trabalhos de infraestrutura, cloud, suporte, automação e desenvolvimento.',
}

export default async function PaginaProjetos() {
  const projetos = await listarProjetos({ limite: 200 })

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <SecaoTitulo
        comando="ls -la ~/projetos"
        titulo="Projetos"
        descricao={`${projetos.length} ${projetos.length === 1 ? 'projeto documentado' : 'projetos documentados'}.`}
      />

      {projetos.length === 0 ? (
        <p className="mono text-sm text-ink-dim">
          nenhum projeto publicado ainda — cadastre o primeiro em{' '}
          <a href="/admin" className="text-verde hover:underline">
            /admin
          </a>
          .
        </p>
      ) : (
        <FiltroProjetos projetos={projetos} />
      )}
    </div>
  )
}
