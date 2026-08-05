/**
 * Bloqueio de tentativas de login, em memória.
 *
 * Vale porque a aplicação roda como processo único no Discloud (ver
 * Dockerfile — "Um processo só"). Se um dia isso rodar em múltiplas réplicas,
 * o contador precisa virar algo compartilhado (Redis, tabela no MySQL etc.),
 * senão cada instância teria seu próprio limite.
 */
const MAX_TENTATIVAS = 5
const JANELA_MS = 15 * 60 * 1000
const BLOQUEIO_MS = 15 * 60 * 1000

const tentativas = new Map()

const janelaExpirou = (registro, agora) => registro.desde + JANELA_MS < agora

/** Remove entradas antigas para o Map não crescer indefinidamente. */
const limparExpiradas = () => {
  const agora = Date.now()
  for (const [chave, registro] of tentativas) {
    if (registro.bloqueadoAte < agora && janelaExpirou(registro, agora)) {
      tentativas.delete(chave)
    }
  }
}

const varredura = setInterval(limparExpiradas, 30 * 60 * 1000)
varredura.unref?.()

export function estaBloqueado(chave) {
  const registro = tentativas.get(chave)
  return Boolean(registro && registro.bloqueadoAte > Date.now())
}

export function registrarFalha(chave) {
  const agora = Date.now()
  const registro = tentativas.get(chave) ?? { contagem: 0, desde: agora, bloqueadoAte: 0 }

  if (janelaExpirou(registro, agora)) {
    registro.contagem = 0
    registro.desde = agora
  }

  registro.contagem += 1
  if (registro.contagem >= MAX_TENTATIVAS) {
    registro.bloqueadoAte = agora + BLOQUEIO_MS
  }

  tentativas.set(chave, registro)
}

export function limparTentativas(chave) {
  tentativas.delete(chave)
}
