/**
 * Transforma um título em slug de URL: sem acentos, minúsculo, hifenizado.
 * @param {string} valor
 * @returns {string}
 */
export const formatSlug = (valor) =>
  valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove os acentos separados pelo NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
