# ─────────────────────────────────────────────────────────────
#  Site pessoal — Next.js 16 + Sequelize + MySQL
#  Um processo só. O banco é externo (o seu MySQL).
# ─────────────────────────────────────────────────────────────

# ── Etapa 1: build ───────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# sharp precisa de toolchain para compilar quando não há binário pronto
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build


# ── Etapa 2: runtime ─────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0 \
    CONFIG_FILE=/app/data/config.json

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Saída standalone do Next: server.js + só as dependências usadas
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Lidas em tempo de execução pelo Umzug — não entram no bundle do Next.
COPY --from=builder /app/migrations ./migrations

# data/ → config.json gravado pelo instalador (uploads do painel ficam no banco)
RUN mkdir -p /app/data

EXPOSE 8080

CMD ["node", "server.js"]
