/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera .next/standalone — imagem Docker enxuta, sem node_modules completo.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  // Sequelize e o driver do MySQL têm require dinâmico; deixa fora do bundle.
  serverExternalPackages: ['sequelize', 'mysql2', 'sharp'],

  async headers() {
    return [
      {
        source: '/:caminho*',
        headers: [
          // Impede que o navegador tente "adivinhar" o tipo de um arquivo
          // servido com content-type errado — relevante sobretudo pra
          // /midia, que serve upload de usuário (inclui SVG).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Nada do site precisa ser embutido em <iframe> de outra origem.
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

export default nextConfig
