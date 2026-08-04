/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera .next/standalone — imagem Docker enxuta, sem node_modules completo.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  // Sequelize e o driver do MySQL têm require dinâmico; deixa fora do bundle.
  serverExternalPackages: ['sequelize', 'mysql2', 'sharp'],
}

export default nextConfig
