/**
 * Traduz erros do Sequelize/MySQL para uma frase que faça sentido no painel,
 * usando o rótulo do campo em vez do nome da coluna.
 */
export function mensagemDeErro(erro, campos = []) {
  const rotuloDe = (coluna) => campos.find((c) => c.nome === coluna)?.rotulo ?? coluna

  const nome = erro?.name
  const bruto = erro?.original?.message || erro?.message || String(erro)

  if (nome === 'SequelizeUniqueConstraintError') {
    const campo = erro?.errors?.[0]?.path
    return campo === 'slug'
      ? 'Já existe outro registro com esse slug. Mude o título ou informe um slug diferente.'
      : `Já existe um registro com esse valor em "${rotuloDe(campo)}".`
  }

  if (nome === 'SequelizeValidationError') {
    return erro.errors.map((e) => `${rotuloDe(e.path)}: ${e.message}`).join(' · ')
  }

  // MySQL: Data too long for column 'descricao' at row 1
  const longo = bruto.match(/Data too long for column '([^']+)'/i)
  if (longo) {
    return `O campo "${rotuloDe(longo[1])}" passou do tamanho máximo permitido.`
  }

  // MySQL: Unknown column 'x' in 'field list'  →  tabela desatualizada
  const desconhecida = bruto.match(/Unknown column '([^']+)'/i)
  if (desconhecida) {
    return `A coluna "${desconhecida[1]}" não existe no banco. Use "sincronizar estrutura" no painel para atualizar as tabelas.`
  }

  const nulo = bruto.match(/Column '([^']+)' cannot be null/i)
  if (nulo) {
    return `O campo "${rotuloDe(nulo[1])}" é obrigatório.`
  }

  return bruto
}

/**
 * Confere os limites de tamanho antes de ir ao banco, para a mensagem sair
 * amigável em vez de virar erro de SQL.
 */
export function validarTamanhos(campos, dados) {
  for (const campo of campos) {
    if (!campo.maxLength) continue

    const valor = dados[campo.nome]
    if (typeof valor === 'string' && valor.length > campo.maxLength) {
      return `"${campo.rotulo}" tem ${valor.length} caracteres — o limite é ${campo.maxLength}.`
    }
  }

  return null
}
