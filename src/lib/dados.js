import { getBd } from '@/bd/conexao'

/**
 * Envolve as consultas: se o site ainda não foi instalado ou o banco cair,
 * a página continua de pé mostrando o que conseguiu carregar.
 */
const seguro = async (fn, reserva) => {
  try {
    const bd = await getBd()
    if (!bd) return reserva
    return await fn(bd)
  } catch (erro) {
    console.error('[dados]', erro?.message ?? erro)
    return reserva
  }
}

const puro = (registro) => (registro ? registro.get({ plain: true }) : null)
const puros = (registros) => registros.map((r) => r.get({ plain: true }))

const comMidia = (bd, campos) =>
  campos.map((as) => ({ model: bd.modelos.Midia, as, required: false }))

export const getPerfil = () =>
  seguro(async (bd) => {
    const perfil = await bd.modelos.Perfil.findByPk(1, {
      include: comMidia(bd, ['foto', 'curriculo']),
    })
    return puro(perfil)
  }, null)

export const listarProjetos = ({ limite = 100, apenasDestaque = false } = {}) =>
  seguro(async (bd) => {
    const registros = await bd.modelos.Projeto.findAll({
      where: { publicado: true, ...(apenasDestaque ? { destaque: true } : {}) },
      include: comMidia(bd, ['capa']),
      order: [
        ['inicio', 'DESC'],
        ['id', 'DESC'],
      ],
      limit: limite,
    })
    return puros(registros)
  }, [])

export const getProjeto = (slug) =>
  seguro(async (bd) => {
    const projeto = await bd.modelos.Projeto.findOne({
      where: { slug, publicado: true },
      include: comMidia(bd, ['capa']),
    })
    return puro(projeto)
  }, null)

export const listarNotas = ({ limite = 100, apenasDestaque = false } = {}) =>
  seguro(async (bd) => {
    const registros = await bd.modelos.Nota.findAll({
      where: { publicado: true, ...(apenasDestaque ? { destaque: true } : {}) },
      order: [
        ['publicadoEm', 'DESC'],
        ['id', 'DESC'],
      ],
      limit: limite,
    })
    return puros(registros)
  }, [])

export const getNota = (slug) =>
  seguro(async (bd) => {
    const nota = await bd.modelos.Nota.findOne({ where: { slug, publicado: true } })
    return puro(nota)
  }, null)

export const listarCertificacoes = () =>
  seguro(async (bd) => {
    const registros = await bd.modelos.Certificacao.findAll({
      where: { publicado: true },
      include: comMidia(bd, ['logo']),
      order: [
        ['situacao', 'ASC'],
        ['emitidaEm', 'DESC'],
      ],
    })
    return puros(registros)
  }, [])

export const listarExperiencias = () =>
  seguro(async (bd) => {
    const registros = await bd.modelos.Experiencia.findAll({
      where: { publicado: true },
      order: [
        ['atual', 'DESC'],
        ['inicio', 'DESC'],
      ],
    })
    return puros(registros)
  }, [])

export const listarHabilidades = () =>
  seguro(async (bd) => {
    const registros = await bd.modelos.Habilidade.findAll({
      where: { publicado: true },
      order: [
        ['ordem', 'ASC'],
        ['nome', 'ASC'],
      ],
    })
    return puros(registros)
  }, [])
