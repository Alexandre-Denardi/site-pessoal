import fs from 'fs/promises'
import path from 'path'

const PASTA = process.env.MEDIA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'media')

const TIPOS = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

/** Serve os arquivos enviados pelo painel (ficam fora de public/). */
export async function GET(request, { params }) {
  const { arquivo } = await params

  // Só o nome do arquivo — nada de subir diretórios.
  const nome = path.basename(arquivo)
  const caminho = path.join(/*turbopackIgnore: true*/ PASTA, nome)

  try {
    const dados = await fs.readFile(/*turbopackIgnore: true*/ caminho)
    const tipo = TIPOS[path.extname(nome).toLowerCase()] || 'application/octet-stream'

    return new Response(dados, {
      headers: {
        'Content-Type': tipo,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Arquivo não encontrado', { status: 404 })
  }
}
