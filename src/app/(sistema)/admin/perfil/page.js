import { salvarPerfil } from '@/admin/acoes'
import { CAMPOS_PERFIL } from '@/admin/esquemas'
import { getBd } from '@/bd/conexao'
import { Formulario } from '@/componentes/admin/Formulario'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Perfil & contato' }

export default async function PaginaPerfil({ searchParams }) {
  const { salvo } = await searchParams
  const bd = await getBd()

  const [perfil] = await bd.modelos.Perfil.findOrCreate({
    where: { id: 1 },
    defaults: { id: 1 },
  })

  const midias = (
    await bd.modelos.Midia.findAll({ order: [['id', 'DESC']], limit: 200 })
  ).map((m) => m.get({ plain: true }))

  return (
    <>
      <SecaoTitulo
        comando="vim ~/perfil"
        titulo="Perfil & contato"
        descricao="Seus dados, o texto do topo e os links de contato."
      />

      {salvo ? (
        <p className="mono mb-5 rounded border border-verde-esc/60 bg-verde/10 px-3 py-2.5 text-xs text-verde">
          ✓ perfil salvo
        </p>
      ) : null}

      <Formulario
        campos={CAMPOS_PERFIL}
        valores={perfil.get({ plain: true })}
        midias={midias}
        voltarPara="/admin"
        acao={salvarPerfil}
      />
    </>
  )
}
