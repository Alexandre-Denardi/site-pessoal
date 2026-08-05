import { Cabecalho } from '@/componentes/Cabecalho'
import { Rodape } from '@/componentes/Rodape'
import { getPerfil } from '@/lib/dados'

import '../globals.css'

export const dynamic = 'force-dynamic'

// Aplica o tema salvo antes da primeira pintura, para não piscar branco.
const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem('tema')||'escuro';document.documentElement.setAttribute('data-tema',t)}catch(e){}})()`

export async function generateMetadata() {
  const perfil = await getPerfil()
  const nome = perfil?.nome || 'Site pessoal'
  const titulo = perfil?.tituloSeo || `${nome} — ${perfil?.headline ?? 'Tecnologia'}`

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: titulo, template: `%s · ${nome}` },
    description: perfil?.descricaoSeo || perfil?.bio || undefined,
    openGraph: {
      title: titulo,
      description: perfil?.descricaoSeo || perfil?.bio || undefined,
      type: 'website',
      locale: 'pt_BR',
    },
    icons: perfil?.favicon ? { icon: `/midia/${perfil.favicon.arquivo}` } : undefined,
    robots: { index: true, follow: true },
  }
}

export default async function LayoutSite({ children }) {
  const perfil = await getPerfil()

  return (
    <html lang="pt-BR" data-tema="escuro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="mono sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:border focus:border-verde focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-verde"
        >
          pular para o conteúdo
        </a>

        <Cabecalho prompt={perfil?.promptUsuario || 'visitante@site'} />

        <main id="conteudo">{children}</main>

        <Rodape perfil={perfil} />
      </body>
    </html>
  )
}
