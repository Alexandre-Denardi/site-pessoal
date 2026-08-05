import path from 'path'

import { getBd } from '@/bd/conexao'

const TIPOS = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

export const dynamic = 'force-dynamic'

/** Serve os arquivos enviados pelo painel — ficam como BLOB no banco. */
export async function GET(request, { params }) {
  const { arquivo } = await params

  // Só o nome do arquivo, sem separador de diretório.
  const nome = path.basename(arquivo)

  const bd = await getBd()
  if (!bd) return new Response('Arquivo não encontrado', { status: 404 })

  const registro = await bd.modelos.Midia.findOne({
    where: { arquivo: nome },
    attributes: ['mime', 'dados'],
  })

  if (!registro?.dados) return new Response('Arquivo não encontrado', { status: 404 })

  const tipo = registro.mime || TIPOS[path.extname(nome).toLowerCase()] || 'application/octet-stream'

  return new Response(registro.dados, {
    headers: {
      'Content-Type': tipo,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
