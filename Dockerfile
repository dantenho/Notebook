# ═══════════════════════════════════════════════════════════════
# Dockerfile Multi-Stage para Study Notebook
# ═══════════════════════════════════════════════════════════════
#
# Build de produção otimizado com 3 estágios:
# 1. Backend Build - Compila TypeScript do backend
# 2. Frontend Build - Compila React + Vite
# 3. Production - Imagem final leve
#

# ═══════════════════════════════════════════════════════════════
# STAGE 1: Backend Build
# ═══════════════════════════════════════════════════════════════
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copiar package files do backend
COPY backend/package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte do backend
COPY backend/ ./

# Compilar TypeScript
RUN npm run build

# Limpar devDependencies
RUN npm prune --production

# ═══════════════════════════════════════════════════════════════
# STAGE 2: Frontend Build
# ═══════════════════════════════════════════════════════════════
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar package files do frontend
COPY frontend/package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte do frontend
COPY frontend/ ./

# Build de produção
RUN npm run build

# ═══════════════════════════════════════════════════════════════
# STAGE 3: Production
# ═══════════════════════════════════════════════════════════════
FROM node:18-alpine

# Metadata
LABEL maintainer="Study Notebook Team"
LABEL version="1.1.0"
LABEL description="Study Notebook - AI-powered study management app"

# Instalar dependências do sistema
RUN apk add --no-cache \
    sqlite \
    tini

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar backend compilado do stage 1
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/package*.json ./backend/

# Copiar frontend compilado do stage 2
COPY --from=frontend-builder --chown=nodejs:nodejs /app/frontend/dist ./frontend/dist

# Copiar arquivos de configuração
COPY --chown=nodejs:nodejs backend/.env.example ./backend/.env

# Criar diretórios necessários
RUN mkdir -p \
    /app/backend/uploads \
    /app/backend/database \
    && chown -R nodejs:nodejs /app

# Variáveis de ambiente
ENV NODE_ENV=production \
    PORT=3001 \
    DATABASE_PATH=/app/backend/database/database.sqlite \
    UPLOADS_PATH=/app/backend/uploads

# Expor porta
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Trocar para usuário não-root
USER nodejs

# Volume para persistência de dados
VOLUME ["/app/backend/database", "/app/backend/uploads"]

# Usar tini para gerenciar processos
ENTRYPOINT ["/sbin/tini", "--"]

# Iniciar servidor
CMD ["node", "backend/dist/index.js"]
