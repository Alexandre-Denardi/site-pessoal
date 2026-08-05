import { NextResponse } from 'next/server'

import { NOME_COOKIE, lerToken } from '@/lib/tokenSessao'

// Cobre /admin e qualquer rota abaixo dela — inclusive as que ainda não
// existem. Cada Server Action em admin/acoes.js também confere login por
// conta própria (defesa em profundidade); isto aqui garante que uma rota
// nova sob /admin não fique exposta por esquecimento.
export const config = {
  matcher: ['/admin/:path*'],
}

export function proxy(request) {
  const token = request.cookies.get(NOME_COOKIE)?.value

  // Só confere assinatura e validade — não consulta o banco (isso fica a
  // cargo de `usuarioAtual()`, chamado no layout e nas Server Actions).
  if (!lerToken(token)) {
    const destino = request.nextUrl.clone()
    destino.pathname = '/entrar'
    destino.search = ''
    return NextResponse.redirect(destino)
  }

  return NextResponse.next()
}
