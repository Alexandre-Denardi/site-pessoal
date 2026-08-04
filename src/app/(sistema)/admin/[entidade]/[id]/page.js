import Link from 'next/link'
import { notFound } from 'next/navigation'

import { salvarRegistro } from '@/admin/acoes'
import { getEsquema } from '@/admin/esquemas'
import { getBd } from '@/bd/conexao'
import { Formulario } from '@/componentes/admin/Formulario'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { entidade, id } = await params
  const esquema = getEsquema(entidade)
  if (!esquema) return { title: 'Painel' }

  return { title: id === 'novo' ? `Novo ${esquema.singular.toLowerCase()}` : esquema.singular }
}

/** Valores iniciais de um registro novo, a partir dos padrões do esquema. */
const padroes = (esquema) => {
  const valores = {}

  for (const campo of esquema.campos) {
    valores[campo.nome] = typeof campo.padrao === 'function' ? campo.padrao() : campo.padrao
  }

  return valores
}

export default async function FormularioEntidade({ params }) {
  const { entidade, id } = await params
  const esquema = getEsquema(entidade)
  if (!esquema) notFound()

  const bd = await getBd()
  const novo = id === 'novo'

  let valores = padroes(esquema)

  if (!novo) {
    const registro = await bd.modelos[esquema.modelo].findByPk(Number(id))
    if (!registro) notFound()
    valores = registro.get({ plain: true })
  }

  const midias = (
    await bd.modelos.Midia.findAll({ order: [['id', 'DESC']], limit: 200 })
  ).map((m) => m.get({ plain: true }))

  return (
    <>
      <p className="mono mb-6 text-sm text-ink-dim">
        <Link href={`/admin/${entidade}`} className="hover:text-verde">
          cd ..
        </Link>
        <span className="mx-2 text-line-forte">|</span>
        <span className="text-verde">~/{entidade}/</span>
        {novo ? 'novo' : id}
      </p>

      <SecaoTitulo
        comando={novo ? `touch ${entidade}` : `vim ${entidade}/${id}`}
        titulo={novo ? `Novo ${esquema.singular.toLowerCase()}` : `Editar ${esquema.singular.toLowerCase()}`}
      />

      <Formulario
        campos={esquema.campos}
        valores={valores}
        midias={midias}
        voltarPara={`/admin/${entidade}`}
        acao={salvarRegistro.bind(null, entidade, id)}
      />
    </>
  )
}
