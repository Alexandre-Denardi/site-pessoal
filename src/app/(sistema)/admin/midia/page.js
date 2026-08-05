import { enviarMidia, excluirMidia } from '@/admin/acoes'
import { getBd } from '@/bd/conexao'
import { BotaoExcluir } from '@/componentes/admin/BotaoExcluir'
import { SecaoTitulo } from '@/componentes/SecaoTitulo'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Mídia' }

const tamanhoLegivel = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const MENSAGENS_ERRO = {
  vazio: 'selecione um arquivo antes de enviar.',
  tipo: 'tipo de arquivo não permitido. Use imagem (png, jpg, webp, gif, svg) ou PDF.',
  tamanho: 'arquivo maior que 10 MB.',
}

export default async function PaginaMidia({ searchParams }) {
  const { erro } = await searchParams
  const bd = await getBd()

  const arquivos = (
    await bd.modelos.Midia.findAll({
      attributes: { exclude: ['dados'] },
      order: [['id', 'DESC']],
    })
  ).map((m) => m.get({ plain: true }))

  return (
    <>
      <SecaoTitulo
        comando="ls ~/midia"
        titulo="Mídia"
        descricao="Imagens de capa, logos de certificação, foto e currículo em PDF."
      />

      <form action={enviarMidia} className="cartao mb-8 p-5">
        {erro ? (
          <p className="mono mb-4 rounded border border-vermelho/50 bg-vermelho/10 px-3 py-2 text-xs text-vermelho">
            ✗ {MENSAGENS_ERRO[erro] || 'não foi possível enviar o arquivo.'}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="arquivo" className="mono mb-1.5 block text-xs text-ink-dim">
              Arquivo
            </label>
            <input
              id="arquivo"
              name="arquivo"
              type="file"
              accept="image/*,application/pdf"
              required
              className="mono w-full rounded border border-line bg-surface-2 px-3 py-2 text-xs text-ink-dim file:mr-3 file:rounded file:border-0 file:bg-verde/10 file:px-3 file:py-1 file:text-verde"
            />
          </div>

          <div>
            <label htmlFor="alt" className="mono mb-1.5 block text-xs text-ink-dim">
              Descrição (texto alternativo)
            </label>
            <input
              id="alt"
              name="alt"
              type="text"
              className="mono w-full rounded border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-verde-esc"
            />
          </div>

          <button
            type="submit"
            className="mono rounded border border-verde-esc bg-verde/10 px-4 py-2 text-sm text-verde transition hover:bg-verde/20"
          >
            enviar
          </button>
        </div>
      </form>

      {arquivos.length === 0 ? (
        <p className="mono text-sm text-ink-dim">nenhum arquivo enviado ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {arquivos.map((arquivo) => (
            <div key={arquivo.id} className="cartao overflow-hidden">
              {arquivo.mime?.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/midia/${arquivo.arquivo}`}
                  alt={arquivo.alt || ''}
                  className="h-36 w-full border-b border-line object-cover"
                />
              ) : (
                <div className="mono flex h-36 items-center justify-center border-b border-line bg-surface-2 text-xs text-ink-dim">
                  {arquivo.mime || 'arquivo'}
                </div>
              )}

              <div className="p-4">
                <p className="mono truncate text-xs text-ink" title={arquivo.nomeOriginal}>
                  {arquivo.nomeOriginal || arquivo.arquivo}
                </p>
                <p className="mono mt-1 text-[0.7rem] text-ink-dim">
                  {tamanhoLegivel(arquivo.tamanho)}
                  {arquivo.largura ? ` · ${arquivo.largura}×${arquivo.altura}` : ''}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`/midia/${arquivo.arquivo}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mono rounded border border-line px-2.5 py-1 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
                  >
                    abrir ↗
                  </a>
                  <BotaoExcluir
                    acao={excluirMidia.bind(null, arquivo.id)}
                    aviso={`Excluir "${arquivo.nomeOriginal || arquivo.arquivo}"?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
