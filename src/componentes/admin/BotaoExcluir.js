'use client'

export function BotaoExcluir({ acao, rotulo = 'excluir', aviso = 'Excluir este item?' }) {
  return (
    <form
      action={acao}
      onSubmit={(evento) => {
        if (!window.confirm(aviso)) evento.preventDefault()
      }}
      className="inline"
    >
      <button
        type="submit"
        className="mono rounded border border-line px-2.5 py-1 text-xs text-ink-dim transition hover:border-vermelho hover:text-vermelho"
      >
        {rotulo}
      </button>
    </form>
  )
}
