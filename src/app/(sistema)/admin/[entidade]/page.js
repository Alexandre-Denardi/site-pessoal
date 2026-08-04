import Link from 'next/link'
import { notFound } from 'next/navigation'

import { excluirRegistro } from '@/admin/acoes'
import { getEsquema } from '@/admin/esquemas'
import { getBd } from '@/bd/conexao'
import { BotaoExcluir } from '@/componentes/admin/BotaoExcluir'
import { Etiqueta } from '@/componentes/Etiqueta'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'
import { dataCurta } from '@/lib/formato'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { entidade } = await params
  const esquema = getEsquema(entidade)
  return { title: esquema?.plural ?? 'Painel' }
}

const celula = (registro, coluna) => {
  const valor = registro[coluna.campo]

  if (coluna.tipo === 'booleano') {
    return valor ? (
      <Etiqueta variante="verde">sim</Etiqueta>
    ) : (
      <Etiqueta>não</Etiqueta>
    )
  }

  if (coluna.tipo === 'data') return dataCurta(valor) ?? '—'

  return valor == null || valor === '' ? '—' : String(valor)
}

export default async function ListaEntidade({ params }) {
  const { entidade } = await params
  const esquema = getEsquema(entidade)
  if (!esquema) notFound()

  const bd = await getBd()
  const registros = await bd.modelos[esquema.modelo].findAll({ order: esquema.ordenar })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SecaoTitulo
          comando={esquema.comando}
          titulo={esquema.plural}
          descricao={esquema.descricao}
        />
        <Link
          href={`/admin/${entidade}/novo`}
          className="mono mb-1 rounded border border-verde-esc bg-verde/10 px-3.5 py-2 text-sm text-verde transition hover:bg-verde/20"
        >
          + novo
        </Link>
      </div>

      {registros.length === 0 ? (
        <div className="cartao p-8 text-center">
          <p className="mono text-sm text-ink-dim">nada cadastrado ainda.</p>
          <Link
            href={`/admin/${entidade}/novo`}
            className="mono mt-4 inline-block rounded border border-verde-esc bg-verde/10 px-3.5 py-2 text-sm text-verde transition hover:bg-verde/20"
          >
            criar o primeiro
          </Link>
        </div>
      ) : (
        <div className="cartao overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-line">
                {esquema.colunas.map((coluna) => (
                  <th
                    key={coluna.campo}
                    className="mono px-4 py-3 text-left text-xs font-normal text-verde"
                  >
                    {coluna.rotulo}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => {
                const item = registro.get({ plain: true })

                return (
                  <tr key={item.id} className="border-b border-line/60 last:border-0">
                    {esquema.colunas.map((coluna, indice) => (
                      <td key={coluna.campo} className="px-4 py-3 align-middle">
                        {indice === 0 ? (
                          <Link
                            href={`/admin/${entidade}/${item.id}`}
                            className="text-ink transition hover:text-verde"
                          >
                            {celula(item, coluna)}
                          </Link>
                        ) : (
                          <span className="text-ink-dim">{celula(item, coluna)}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/${entidade}/${item.id}`}
                        className="mono mr-2 rounded border border-line px-2.5 py-1 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
                      >
                        editar
                      </Link>
                      <BotaoExcluir
                        acao={excluirRegistro.bind(null, entidade, item.id)}
                        aviso={`Excluir "${item[esquema.colunas[0].campo]}"? Não dá para desfazer.`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
