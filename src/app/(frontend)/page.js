import Link from 'next/link'

import { CartaoNota } from '@/componentes/CartaoNota'
import { CartaoProjeto } from '@/componentes/CartaoProjeto'
import { Conteudo } from '@/componentes/Conteudo'
import { Digitando } from '@/componentes/Digitando'
import { Etiqueta } from '@/componentes/Etiqueta'
import { Imagem } from '@/componentes/Imagem'
import { Janela } from '@/componentes/Janela'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'
import {
  getPerfil,
  listarCertificacoes,
  listarExperiencias,
  listarHabilidades,
  listarNotas,
  listarProjetos,
} from '@/lib/dados'
import { estadoInstalacao } from '@/lib/estado'
import { ROTULO_CATEGORIA_STACK, mesAno, periodo } from '@/lib/formato'

export const dynamic = 'force-dynamic'

const VARIANTE_SITUACAO = {
  obtida: 'verde',
  'em-andamento': 'ambar',
  planejada: 'neutra',
}

const ROTULO_SITUACAO = {
  obtida: 'obtida',
  'em-andamento': 'em andamento',
  planejada: 'planejada',
}

export default async function Home() {
  const estado = await estadoInstalacao()

  // Primeiro acesso: em vez de uma home vazia, manda instalar.
  if (estado.etapa !== 'pronto') {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <Janela titulo="site não instalado" className="scanlines" corpoClassName="p-8">
          <p className="mono text-sm text-ink-dim">
            <span className="text-verde">$</span> status
          </p>
          <h1 className="mono mt-4 text-2xl font-bold text-ink">Falta configurar o banco</h1>
          <p className="mt-3 leading-relaxed text-ink-dim">
            O site ainda não foi instalado. Informe os dados do seu MySQL e crie o usuário
            administrador para começar a publicar.
          </p>
          <p className="mono mt-8 text-sm">
            <Link
              href="/instalar"
              className="rounded border border-verde-esc bg-verde/10 px-4 py-2 text-verde transition hover:bg-verde/20"
            >
              ./instalar.sh →
            </Link>
          </p>
        </Janela>
      </div>
    )
  }

  const [perfil, projetos, notas, certificacoes, experiencias, habilidades] = await Promise.all([
    getPerfil(),
    listarProjetos({ limite: 4, apenasDestaque: true }),
    listarNotas({ limite: 3 }),
    listarCertificacoes(),
    listarExperiencias(),
    listarHabilidades(),
  ])

  // Se nada foi marcado como destaque, mostra os mais recentes mesmo assim.
  const projetosHome = projetos.length > 0 ? projetos : await listarProjetos({ limite: 4 })

  const frases = (perfil?.frases ?? []).filter(Boolean)
  const prompt = perfil?.promptUsuario || 'eu@infra'

  const porCategoria = habilidades.reduce((acc, item) => {
    ;(acc[item.categoria] ??= []).push(item)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <Janela titulo={`${prompt}: ~/perfil`} className="scanlines" corpoClassName="p-6 sm:p-9">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="mono text-sm text-ink-dim">
                <span className="text-verde">{prompt}</span>:~$ whoami
              </p>

              <h1 className="mono mt-4 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-5xl">
                {perfil?.nome || 'Configure seu perfil no painel'}
              </h1>

              <p className="mt-3 text-lg text-ink-dim sm:text-xl">{perfil?.headline}</p>
            </div>

            {perfil?.foto ? (
              <Imagem
                midia={perfil.foto}
                alt={perfil.foto.alt || perfil.nome}
                className="hidden size-28 shrink-0 rounded-lg border border-line object-cover sm:block"
              />
            ) : null}
          </div>

          {frases.length > 0 ? (
            <p className="mono mt-6 text-sm sm:text-base">
              <span className="text-ink-dim">{prompt}:~$ </span>
              <Digitando frases={frases} />
            </p>
          ) : null}

          {perfil?.bio ? (
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-dim">{perfil.bio}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projetos"
              className="mono rounded border border-verde-esc bg-verde/10 px-4 py-2 text-sm text-verde transition hover:bg-verde/20"
            >
              ./ver-projetos
            </Link>
            <Link
              href="/notas"
              className="mono rounded border border-line px-4 py-2 text-sm text-ink-dim transition hover:border-verde-esc hover:text-verde"
            >
              ./ler-notas
            </Link>
            {perfil?.curriculo?.arquivo ? (
              <a
                href={`/midia/${perfil.curriculo.arquivo}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mono rounded border border-line px-4 py-2 text-sm text-ink-dim transition hover:border-verde-esc hover:text-verde"
              >
                ./baixar-cv ↓
              </a>
            ) : null}
            {perfil?.disponivel ? (
              <span className="mono ml-1 inline-flex items-center gap-2 text-xs text-verde">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-verde opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-verde" />
                </span>
                disponível para novas oportunidades
              </span>
            ) : null}
          </div>

          {perfil?.estatisticas?.length ? (
            <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-4">
              {perfil.estatisticas.map((item) => (
                <div key={item.rotulo} className="bg-surface p-4">
                  <dt className="mono text-xs text-ink-dim">{item.rotulo}</dt>
                  <dd className="mono mt-1 text-2xl font-semibold text-verde">{item.valor}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Janela>
      </section>

      {/* ── Sobre ────────────────────────────────────────── */}
      {perfil?.sobre ? (
        <section className="py-14">
          <SecaoTitulo comando="cat sobre.md" titulo="Sobre" id="sobre" />
          <div className="max-w-3xl">
            <Conteudo texto={perfil.sobre} />
          </div>
        </section>
      ) : null}

      {/* ── Stack ────────────────────────────────────────── */}
      {habilidades.length > 0 ? (
        <section className="py-14">
          <SecaoTitulo
            comando="ls -1 ~/stack"
            titulo="Stack"
            descricao="O que eu uso no dia a dia, por área."
            id="stack"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(porCategoria).map(([categoria, itens]) => (
              <div key={categoria} className="cartao p-5">
                <h3 className="mono mb-3 text-sm text-verde">
                  {ROTULO_CATEGORIA_STACK[categoria] ?? categoria}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {itens.map((item) => (
                    <li key={item.id}>
                      <Etiqueta variante={item.nivel === 'avancado' ? 'verde' : 'neutra'}>
                        {item.nome}
                      </Etiqueta>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Experiência ──────────────────────────────────── */}
      {experiencias.length > 0 ? (
        <section className="py-14">
          <SecaoTitulo comando="cat experiencia.log" titulo="Experiência" id="experiencia" />
          <ol className="relative border-l border-line pl-6">
            {experiencias.map((exp) => (
              <li key={exp.id} className="relative pb-9 last:pb-0">
                <span
                  className={`absolute top-1.5 -left-[1.655rem] size-2.5 rounded-full border-2 border-base ${
                    exp.atual ? 'bg-verde' : 'bg-line-forte'
                  }`}
                  aria-hidden="true"
                />
                <p className="mono text-xs text-ink-dim">
                  {periodo(exp.inicio, exp.fim, exp.atual)}
                  {exp.local ? ` · ${exp.local}` : ''}
                </p>
                <h3 className="mono mt-1 text-lg font-semibold text-ink">{exp.cargo}</h3>
                <p className="text-sm text-verde">{exp.empresa}</p>

                {exp.descricao ? (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-dim">
                    {exp.descricao}
                  </p>
                ) : null}

                {exp.atividades?.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {exp.atividades.map((atividade) => (
                      <li key={atividade} className="flex gap-2 text-sm text-ink-dim">
                        <span className="mono text-verde">▸</span>
                        <span>{atividade}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {exp.tecnologias?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tecnologias.map((t) => (
                      <li key={t}>
                        <Etiqueta>{t}</Etiqueta>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* ── Certificações ────────────────────────────────── */}
      {certificacoes.length > 0 ? (
        <section className="py-14">
          <SecaoTitulo
            comando="ls ~/certificacoes"
            titulo="Certificações"
            descricao="Credenciais obtidas e as que estão em andamento."
            id="certificacoes"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificacoes.map((cert) => {
              // Descrições oficiais costumam ser longas: recolhe para o card não estourar.
              const descricaoLonga = (cert.descricao?.length ?? 0) > 200

              return (
                <div key={cert.id} className="cartao flex flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="mono flex min-w-0 items-center gap-2 text-xs text-ink-dim">
                      {cert.logo ? (
                        <Imagem
                          midia={cert.logo}
                          alt={cert.logo.alt || cert.emissor}
                          className="size-7 shrink-0 rounded object-contain"
                        />
                      ) : null}
                      <span className="truncate">{cert.emissor}</span>
                    </span>
                    <Etiqueta variante={VARIANTE_SITUACAO[cert.situacao] ?? 'neutra'}>
                      {ROTULO_SITUACAO[cert.situacao] ?? cert.situacao}
                    </Etiqueta>
                  </div>

                  <h3 className="mono leading-snug font-semibold text-ink">{cert.nome}</h3>

                  {cert.descricao ? (
                    descricaoLonga ? (
                      <details className="mt-2">
                        <summary className="mono cursor-pointer list-none text-xs text-verde transition hover:underline [&::-webkit-details-marker]:hidden">
                          ▸ descrição completa
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-dim">
                          {cert.descricao}
                        </p>
                      </details>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{cert.descricao}</p>
                    )
                  ) : null}

                  <p className="mono mt-3 flex-1 text-xs text-ink-dim">
                    {cert.emitidaEm ? mesAno(cert.emitidaEm) : '—'}
                    {cert.expiraEm ? ` · expira ${mesAno(cert.expiraEm)}` : ''}
                  </p>

                  {cert.credencialUrl ? (
                    <a
                      href={cert.credencialUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mono mt-3 self-start rounded border border-line px-2.5 py-1 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
                    >
                      verificar credencial ↗
                    </a>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* ── Projetos ─────────────────────────────────────── */}
      {projetosHome.length > 0 ? (
        <section className="py-14">
          <SecaoTitulo
            comando="ls ~/projetos --destaque"
            titulo="Projetos"
            descricao="Trabalhos de infra, cloud, suporte e desenvolvimento."
            id="projetos"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {projetosHome.map((projeto) => (
              <CartaoProjeto key={projeto.id} projeto={projeto} />
            ))}
          </div>
          <p className="mono mt-6 text-sm">
            <Link href="/projetos" className="text-verde hover:underline">
              ver todos os projetos →
            </Link>
          </p>
        </section>
      ) : null}

      {/* ── Notas ────────────────────────────────────────── */}
      {notas.length > 0 ? (
        <section className="py-14">
          <SecaoTitulo
            comando="tail ~/notas"
            titulo="Notas & ideias"
            descricao="Anotações técnicas, runbooks e o que ando pensando."
            id="notas"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notas.map((nota) => (
              <CartaoNota key={nota.id} nota={nota} />
            ))}
          </div>
          <p className="mono mt-6 text-sm">
            <Link href="/notas" className="text-verde hover:underline">
              ver todas as notas →
            </Link>
          </p>
        </section>
      ) : null}

      {/* ── Contato ──────────────────────────────────────── */}
      <section className="py-14" id="contato">
        <SecaoTitulo comando="./contato.sh" titulo="Contato" />
        <Janela titulo="contato.sh" corpoClassName="p-6">
          <p className="mono text-sm text-ink-dim">
            <span className="text-verde">$</span> echo &quot;vamos conversar&quot;
          </p>

          <div className="mono mt-4 space-y-2 text-sm">
            {perfil?.email ? (
              <p>
                <span className="text-ink-dim">e-mail </span>
                <a href={`mailto:${perfil.email}`} className="text-verde hover:underline">
                  {perfil.email}
                </a>
              </p>
            ) : null}

            {perfil?.localizacao ? (
              <p>
                <span className="text-ink-dim">local&nbsp;&nbsp;</span>
                <span className="text-ink">{perfil.localizacao}</span>
              </p>
            ) : null}

            {(perfil?.redes ?? []).map((rede) => (
              <p key={rede.url}>
                <span className="text-ink-dim">{(rede.rede + '      ').slice(0, 6)} </span>
                <a
                  href={rede.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-verde hover:underline"
                >
                  {rede.rotulo || rede.url}
                </a>
              </p>
            ))}
          </div>
        </Janela>
      </section>
    </div>
  )
}
