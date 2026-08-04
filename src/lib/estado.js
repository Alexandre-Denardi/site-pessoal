import { configuradoPorEnv, lerConfig } from '@/bd/config'
import { getBd } from '@/bd/conexao'
import { prepararBanco } from '@/bd/migracoes'

// Quando as credenciais vêm do ambiente ninguém passa pelo instalador,
// então rodamos as migrations na primeira vez que as tabelas fizerem falta.
let tentouSincronizar = false

/**
 * Em que ponto da instalação o site está.
 *
 *  'sem-banco'   → ninguém informou as credenciais ainda
 *  'sem-usuario' → banco conectado, mas falta cadastrar o administrador
 *  'pronto'      → instalado
 *  'erro'        → há credenciais, mas o banco não responde
 */
export async function estadoInstalacao() {
  if (!lerConfig()) return { etapa: 'sem-banco' }

  try {
    const bd = await getBd()
    if (!bd) return { etapa: 'sem-banco' }

    const total = await bd.modelos.Usuario.count()
    return { etapa: total > 0 ? 'pronto' : 'sem-usuario' }
  } catch (erro) {
    if (configuradoPorEnv() && !tentouSincronizar) {
      tentouSincronizar = true

      try {
        await prepararBanco()
        const bd = await getBd()
        const total = await bd.modelos.Usuario.count()
        return { etapa: total > 0 ? 'pronto' : 'sem-usuario' }
      } catch (falha) {
        return { etapa: 'erro', erro: falha?.message ?? String(falha) }
      }
    }

    return { etapa: 'erro', erro: erro?.message ?? String(erro) }
  }
}

export const estaInstalado = async () => (await estadoInstalacao()).etapa === 'pronto'
