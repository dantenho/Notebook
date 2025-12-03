# ═══════════════════════════════════════════════════════════════
# GUIA DE DISTRIBUIÇÃO E INSTALAÇÃO - STUDY NOTEBOOK
# ═══════════════════════════════════════════════════════════════

**Versão:** 1.1.0
**Data:** 2025-11-17
**Autor:** Study Notebook Team

---

## 📋 ÍNDICE

1. [Métodos de Distribuição](#métodos-de-distribuição)
2. [Docker (Recomendado)](#docker-recomendado)
3. [Pacote Windows](#pacote-windows)
4. [Pacote Linux/macOS](#pacote-linuxmacos)
5. [Instalação Rápida](#instalação-rápida)
6. [Instalação Manual](#instalação-manual)
7. [Configuração Avançada](#configuração-avançada)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 MÉTODOS DE DISTRIBUIÇÃO

O Study Notebook oferece **4 métodos de distribuição**:

| Método | Plataforma | Dificuldade | Tamanho | Requer |
|--------|-----------|-------------|---------|--------|
| **Docker** | Todas | ⭐ Fácil | ~200MB | Docker |
| **Pacote Windows** | Windows | ⭐⭐ Média | ~150MB | Node.js |
| **Pacote Linux** | Linux | ⭐⭐ Média | ~150MB | Node.js |
| **Instalação Rápida** | Linux/Mac | ⭐ Fácil | - | curl + bash |

---

## 🐳 DOCKER (RECOMENDADO)

### Por que Docker?

✅ **Vantagens:**
- ✅ Instalação mais simples
- ✅ Isolamento completo
- ✅ Funciona em qualquer sistema (Windows, Linux, macOS)
- ✅ Atualizações facilitadas
- ✅ Configuração de produção pronta
- ✅ Backups simples (volumes)

❌ **Desvantagens:**
- Requer Docker instalado (~500MB)
- Overhead de memória (~100MB extra)

---

### 📦 Instalação com Docker

#### Passo 1: Instalar Docker

**Windows/macOS:**
```bash
# Baixe Docker Desktop de:
https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Passo 2: Baixar o Repositório

```bash
git clone https://github.com/seu-usuario/study-notebook.git
cd study-notebook
```

Ou baixe o ZIP:
```bash
curl -L https://github.com/seu-usuario/study-notebook/archive/main.zip -o study-notebook.zip
unzip study-notebook.zip
cd study-notebook-main
```

#### Passo 3: Iniciar com Docker Compose

```bash
# Iniciar (primeira vez faz o build automaticamente)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

#### Passo 4: Acessar

Abra o navegador em:
```
http://localhost:3001
```

### 🔧 Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Reiniciar
docker-compose restart

# Ver logs apenas do backend
docker-compose logs -f app

# Entrar no container (debug)
docker-compose exec app sh

# Backup do banco de dados
docker cp study-notebook-app:/app/backend/database/database.sqlite ./backup.sqlite

# Restaurar backup
docker cp ./backup.sqlite study-notebook-app:/app/backend/database/database.sqlite

# Atualizar para nova versão
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Limpar tudo (cuidado!)
docker-compose down -v  # Remove também os volumes (dados!)
```

### 🌐 Com Nginx (Frontend Separado)

Para servir o frontend via Nginx:

```bash
# Iniciar com perfil nginx
docker-compose --profile with-nginx up -d

# Acesse:
# - Frontend: http://localhost:80
# - API: http://localhost:3001
```

---

## 🪟 PACOTE WINDOWS

### Pré-requisitos

- Windows 10/11
- Node.js 18+ ([Download](https://nodejs.org))
- 2GB de espaço livre

### Criando o Pacote

#### Opção 1: Build Automático

```powershell
# Abra PowerShell e execute:
.\build-windows.ps1

# Com limpeza prévia:
.\build-windows.ps1 -Clean
```

#### Opção 2: Build Manual

```powershell
# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

### Arquivos Gerados

```
dist/
└── StudyNotebook-Windows-v1.1.0/
    ├── backend/
    │   ├── dist/           # JavaScript compilado
    │   ├── node_modules/   # Dependências
    │   └── .env            # Configuração
    ├── frontend/
    │   └── dist/           # Build React
    ├── database/           # SQLite (vazio)
    ├── uploads/            # Uploads (vazio)
    ├── start.bat           # ⭐ Inicia servidor
    ├── start-background.bat
    └── README.txt
```

### Distribuição

1. **Compactar:**
   ```powershell
   # Já gerado automaticamente:
   dist/StudyNotebook-Windows-v1.1.0.zip
   ```

2. **Compartilhar:**
   - Google Drive
   - OneDrive
   - Dropbox
   - GitHub Releases

### Instalação (Usuário Final)

```powershell
# 1. Descompactar ZIP
# 2. Abrir pasta
cd StudyNotebook-Windows-v1.1.0

# 3. Executar
.\start.bat

# 4. Acessar
# http://localhost:3001
```

---

## 🐧 PACOTE LINUX/MACOS

### Pré-requisitos

- Linux ou macOS
- Node.js 18+
- 2GB de espaço livre

### Criando o Pacote

```bash
# Build automático
./build-package.sh

# Com limpeza prévia
./build-package.sh --clean
```

### Arquivos Gerados

```
dist/
├── StudyNotebook-Linux-v1.1.0/
│   ├── backend/
│   ├── frontend/
│   ├── database/
│   ├── uploads/
│   ├── start.sh         # ⭐ Inicia servidor
│   ├── install.sh       # Instala como serviço systemd
│   └── README.txt
└── StudyNotebook-Linux-v1.1.0.tar.gz
```

### Instalação (Usuário Final)

```bash
# 1. Descompactar
tar -xzf StudyNotebook-Linux-v1.1.0.tar.gz
cd StudyNotebook-Linux-v1.1.0

# 2. Executar
./start.sh

# Ou instalar como serviço (Linux):
sudo ./install.sh
```

### Instalar como Serviço (systemd)

```bash
# Instalar
sudo ./install.sh

# Gerenciar
sudo systemctl status study-notebook
sudo systemctl stop study-notebook
sudo systemctl start study-notebook
sudo systemctl restart study-notebook

# Ver logs
sudo journalctl -u study-notebook -f
```

---

## ⚡ INSTALAÇÃO RÁPIDA (Linux/macOS)

### One-Liner (Recomendado)

```bash
curl -fsSL https://raw.githubusercontent.com/user/repo/main/quick-install.sh | bash
```

### Manual

```bash
# 1. Baixar script
curl -fsSL https://raw.githubusercontent.com/user/repo/main/quick-install.sh -o quick-install.sh

# 2. Dar permissão
chmod +x quick-install.sh

# 3. Executar
./quick-install.sh
```

### O que faz?

1. ✅ Verifica Node.js (instala se necessário)
2. ✅ Baixa código fonte
3. ✅ Instala dependências
4. ✅ Compila backend + frontend
5. ✅ Configura ambiente
6. ✅ Cria script de inicialização
7. ✅ Inicia aplicação (opcional)

---

## 🔧 INSTALAÇÃO MANUAL

Para desenvolvedores ou instalação customizada:

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/study-notebook.git
cd study-notebook

# 2. Backend
cd backend
npm install
npm run build

# 3. Frontend
cd ../frontend
npm install
npm run build

# 4. Configurar
cd ../backend
cp .env.example .env
# Edite .env conforme necessário

# 5. Iniciar
node dist/index.js

# Frontend estará em: frontend/dist (servir com nginx ou similar)
```

---

## ⚙️ CONFIGURAÇÃO AVANÇADA

### Variáveis de Ambiente

Edite `backend/.env`:

```bash
# Porta do servidor
PORT=3001

# Caminho do banco de dados
DATABASE_PATH=./database/database.sqlite

# Caminho de uploads
UPLOADS_PATH=./uploads

# API Keys (opcional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Servidor Llama.cpp local (opcional)
LLAMA_SERVER_URL=http://localhost:8080
```

### Docker: Sobrescrever Configurações

Edite `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - PORT=8080  # Mudar porta
      - OPENAI_API_KEY=sk-...
    ports:
      - "8080:8080"  # Expor porta customizada
```

### Nginx: Configuração Reversa Proxy

```nginx
server {
    listen 80;
    server_name studynotebook.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

---

## 🔒 SEGURANÇA

### Recomendações de Produção

```bash
# 1. Firewall
sudo ufw allow 3001/tcp

# 2. HTTPS (com Certbot)
sudo certbot --nginx -d studynotebook.com

# 3. Backup Automático
0 2 * * * cp /app/backend/database/database.sqlite /backups/db-$(date +\%Y\%m\%d).sqlite

# 4. Limitar acesso ao banco
chmod 600 backend/database/database.sqlite

# 5. Proteger .env
chmod 600 backend/.env
```

---

## 🐛 TROUBLESHOOTING

### Problema: Porta já em uso

```bash
# Verificar processo usando porta 3001
lsof -i :3001        # Linux/macOS
netstat -ano | findstr :3001  # Windows

# Matar processo
kill -9 <PID>        # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Ou mudar porta no .env
PORT=3002
```

### Problema: Erro ao compilar TypeScript

```bash
# Limpar cache
cd backend
rm -rf node_modules dist
npm install
npm run build
```

### Problema: Banco de dados corrompido

```bash
# Verificar integridade
sqlite3 database.sqlite "PRAGMA integrity_check;"

# Restaurar backup
cp backup.sqlite database.sqlite

# Ou recriar
rm database.sqlite
# Reinicie a aplicação (será recriada)
```

### Problema: Docker não inicia

```bash
# Ver logs detalhados
docker-compose logs app

# Rebuild limpo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar recursos
docker system df
docker system prune -a  # Limpar espaço
```

### Problema: Erro de permissão (Linux)

```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x start.sh

# Docker sem sudo
sudo usermod -aG docker $USER
# Logout e login novamente
```

---

## 📊 COMPARAÇÃO DE MÉTODOS

| Critério | Docker | Pacote Windows | Pacote Linux | Instalação Rápida |
|----------|--------|----------------|--------------|-------------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Tamanho Download** | ~200MB | ~150MB | ~150MB | ~150MB |
| **Tempo Instalação** | 5 min | 10 min | 10 min | 15 min |
| **Requer Conhecimento** | Básico | Básico | Médio | Nenhum |
| **Isolamento** | ✅ Total | ❌ Nenhum | ❌ Nenhum | ❌ Nenhum |
| **Atualizações** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Backups** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Produção** | ✅ Ideal | ⚠️ Não recomendado | ✅ OK | ⚠️ Não recomendado |

---

## 🎯 RECOMENDAÇÕES

### Para Desenvolvimento

```bash
# Instalação manual
git clone ...
npm install
npm run dev
```

### Para Testes

```bash
# Docker Compose
docker-compose up -d
```

### Para Produção

```bash
# Docker com volumes externos + Nginx + HTTPS
docker-compose --profile production up -d
```

### Para Distribuição a Usuários Finais

**Windows:** Pacote ZIP + `start.bat`
**Linux:** Script de instalação rápida
**Todos:** Docker (se tiverem conhecimento)

---

## 📚 RECURSOS ADICIONAIS

- **Documentação Completa:** `RELATORIO_VALIDACAO.md`
- **Avaliação de Código:** `CODIGO_AVALIACAO.md`
- **Sistema de Trilhas:** `OTIMIZACOES_UI_TRILHAS.md`
- **Issues:** GitHub Issues
- **Suporte:** suporte@studynotebook.com

---

## 🔄 ATUALIZAÇÕES

### Atualizar Docker

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### Atualizar Instalação Manual

```bash
git pull
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
# Reiniciar servidor
```

---

**Última atualização:** 2025-11-17
**Versão do documento:** 1.0
