import { redirect } from 'next/navigation'

import { FormularioAdmin, FormularioBanco } from './Formularios'
import { configuradoPorEnv } from '@/bd/config'
import { Janela } from '@/componentes/Janela'
import { estadoInstalacao } from '@/lib/estado'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Instalação' }

function Passo({ numero, titulo, ativo, concluido }) {
  const cor = concluido ? 'text-verde' : ativo ? 'text-ink' : 'text-ink-dim/60'
  const marca = concluido ? '[✓]' : ativo ? '[»]' : '[ ]'

  return (
    <span className={`mono text-xs ${cor}`}>
      {marca} {numero}. {titulo}
    </span>
  )
}

export default async function PaginaInstalar() {
  const estado = await estadoInstalacao()

  if (estado.etapa === 'pronto') redirect('/admin')

  const noPasso2 = estado.etapa === 'sem-usuario'

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5 py-14">
      <p className="mono mb-4 text-sm text-ink-dim">
        <span className="text-verde">$</span> ./instalar.sh
      </p>

      <div className="mb-5 flex flex-wrap gap-4">
        <Passo numero={1} titulo="banco de dados" ativo={!noPasso2} concluido={noPasso2} />
        <Passo numero={2} titulo="administrador" ativo={noPasso2} concluido={false} />
      </div>

      <Janela
        titulo={noPasso2 ? 'instalar — passo 2 de 2' : 'instalar — passo 1 de 2'}
        className="scanlines"
        corpoClassName="p-6 sm:p-8"
      >
        {noPasso2 ? (
          <>
            <h1 className="mono text-xl font-semibold text-ink">Crie seu acesso</h1>
            <p className="mt-2 mb-6 text-sm leading-relaxed text-ink-dim">
              As tabelas foram criadas. Agora cadastre o usuário que vai administrar o site.
            </p>
            <FormularioAdmin />
          </>
        ) : (
          <>
            <h1 className="mono text-xl font-semibold text-ink">Conectar ao MySQL</h1>
            <p className="mt-2 mb-6 text-sm leading-relaxed text-ink-dim">
              Informe os dados do banco que você já tem. A conexão é testada antes de gravar.
            </p>

            {estado.etapa === 'erro' ? (
              <p className="mono mb-5 rounded border border-ambar/50 bg-ambar/10 px-3 py-2.5 text-xs leading-relaxed text-ambar">
                ! Já existe uma configuração gravada, mas o banco não respondeu:{' '}
                {estado.erro}. Corrija os dados abaixo.
              </p>
            ) : null}

            {configuradoPorEnv() ? (
              <p className="mono rounded border border-line bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-ink-dim">
                As credenciais estão vindo de variáveis de ambiente. Para usar o instalador,
                remova <span className="text-verde">DB_HOST</span> e{' '}
                <span className="text-verde">DB_NAME</span> do ambiente.
              </p>
            ) : (
              <FormularioBanco />
            )}
          </>
        )}
      </Janela>

      <p className="mono mt-6 text-center text-xs text-ink-dim/70">
        as credenciais ficam em <span className="text-verde">data/config.json</span> (permissão 600)
      </p>
    </div>
  )
}
