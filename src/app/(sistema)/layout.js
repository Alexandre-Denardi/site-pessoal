import '../globals.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
}

const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem('tema')||'escuro';document.documentElement.setAttribute('data-tema',t)}catch(e){}})()`

export default function LayoutSistema({ children }) {
  return (
    <html lang="pt-BR" data-tema="escuro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
