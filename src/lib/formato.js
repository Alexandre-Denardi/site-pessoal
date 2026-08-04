const MESES = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

/** '2024-03-01' → 'mar/2024' */
export const mesAno = (valor) => {
  if (!valor) return null
  const d = new Date(valor)
  if (Number.isNaN(d.getTime())) return null
  return `${MESES[d.getUTCMonth()]}/${d.getUTCFullYear()}`
}

/** '2024-03-09' → '09/03/2024' */
export const dataCurta = (valor) => {
  if (!valor) return null
  const d = new Date(valor)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

/** Monta 'mar/2022 → atual' a partir de início/fim. */
export const periodo = (inicio, fim, atual = false) => {
  const de = mesAno(inicio)
  if (!de) return null
  if (atual) return `${de} → atual`
  const ate = mesAno(fim)
  return ate ? `${de} → ${ate}` : de
}

export const ROTULO_CATEGORIA = {
  infraestrutura: 'infra',
  cloud: 'cloud',
  suporte: 'suporte',
  desenvolvimento: 'dev',
  automacao: 'automação',
  seguranca: 'segurança',
}

export const ROTULO_STATUS = {
  concluido: 'concluído',
  'em-andamento': 'em andamento',
  manutencao: 'manutenção',
  descontinuado: 'descontinuado',
}

export const ROTULO_TIPO_NOTA = {
  anotacao: 'anotação',
  runbook: 'runbook',
  ideia: 'ideia',
  'post-mortem': 'post-mortem',
}

export const ROTULO_CATEGORIA_STACK = {
  infraestrutura: 'Infraestrutura',
  cloud: 'Cloud',
  redes: 'Redes',
  sistemas: 'Sistemas & Workspace',
  desenvolvimento: 'Desenvolvimento',
  seguranca: 'Segurança',
  ferramentas: 'Ferramentas',
}
