import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Conteudo } from '@/componentes/Conteudo'
import { Etiqueta } from '@/componentes/Etiqueta'
import { Imagem } from '@/componentes/Imagem'
import { Janela } from '@/componentes/Janela'
import { getProjeto } from '@/lib/dados'
import { ROTULO_CATEGORIA, ROTULO_STATUS, periodo } from '@/lib/formato'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const projeto = await getProjeto(slug)

  if (!projeto) return { title: 'Projeto não encontrado' }

  return {
    title: projeto.titulo,
    description: projeto.resumo,
    openGraph: { title: projeto.titulo, description: projeto.resumo, type: 'article' },
  }
}

export default async function PaginaProjeto({ params }) {
  const { slug } = await params
  const projeto = await getProjeto(slug)

  if (!projeto) notFound()

  const quando = periodo(projeto.inicio, projeto.fim)

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p className="mono mb-6 text-sm text-ink-dim">
        <Link href="/projetos" className="hover:text-verde">
          cd ..
        </Link>
        <span className="mx-2 text-line-forte">|</span>
        <span className="text-verde">~/projetos/</span>
        {projeto.slug}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Etiqueta variante="verde">
          {ROTULO_CATEGORIA[projeto.categoria] ?? projeto.categoria}
        </Etiqueta>
        <Etiqueta variante={projeto.status === 'concluido' ? 'verde' : 'ambar'}>
          {ROTULO_STATUS[projeto.status] ?? projeto.status}
        </Etiqueta>
        {quando ? <span className="mono text-xs text-ink-dim">{quando}</span> : null}
      </div>

      <h1 className="mono text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl">
        {projeto.titulo}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-ink-dim">{projeto.resumo}</p>

      {projeto.capa ? (
        <Imagem
          midia={projeto.capa}
          alt={projeto.capa.alt || projeto.titulo}
          className="mt-8 max-h-96 w-full rounded-lg border border-line object-cover"
        />
      ) : null}

      {projeto.stack?.length ? (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {projeto.stack.map((item) => (
            <li key={item}>
              <Etiqueta>{item}</Etiqueta>
            </li>
          ))}
        </ul>
      ) : null}

      {projeto.repositorio || projeto.demo ? (
        <div className="mono mt-6 flex flex-wrap gap-3 text-sm">
          {projeto.repositorio ? (
            <a
              href={projeto.repositorio}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded border border-line px-3 py-1.5 text-ink-dim transition hover:border-verde-esc hover:text-verde"
            >
              git clone ↗
            </a>
          ) : null}
          {projeto.demo ? (
            <a
              href={projeto.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded border border-verde-esc bg-verde/10 px-3 py-1.5 text-verde transition hover:bg-verde/20"
            >
              abrir demo ↗
            </a>
          ) : null}
        </div>
      ) : null}

      {projeto.problema || projeto.resultado ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {projeto.problema ? (
            <Janela titulo="problema" corpoClassName="p-5">
              <p className="text-sm leading-relaxed text-ink-dim">{projeto.problema}</p>
            </Janela>
          ) : null}
          {projeto.resultado ? (
            <Janela titulo="resultado" corpoClassName="p-5">
              <p className="text-sm leading-relaxed text-ink-dim">{projeto.resultado}</p>
            </Janela>
          ) : null}
        </div>
      ) : null}

      {projeto.conteudo ? (
        <div className="mt-12 border-t border-line pt-10">
          <Conteudo texto={projeto.conteudo} />
        </div>
      ) : null}

      <p className="mono mt-14 text-sm">
        <Link href="/projetos" className="text-verde hover:underline">
          ← voltar para os projetos
        </Link>
      </p>
    </article>
  )
}
