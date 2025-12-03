#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Script de Build Multiplataforma - Study Notebook
# ═══════════════════════════════════════════════════════════════
#
# Uso:
#   ./build-package.sh [--clean] [--portable]
#
# Requisitos:
#   - Node.js 18+
#   - npm 9+
#   - 2GB de espaço livre
#

set -e  # Parar em caso de erro

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parâmetros
CLEAN=false
PORTABLE=true

for arg in "$@"; do
    case $arg in
        --clean)
            CLEAN=true
            shift
            ;;
        --no-portable)
            PORTABLE=false
            shift
            ;;
    esac
done

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}    STUDY NOTEBOOK - BUILD MULTIPLATAFORMA${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# ═════════════════════════════════════════════════════════════
# Verificar requisitos
# ═════════════════════════════════════════════════════════════
echo -e "${YELLOW}Verificando requisitos...${NC}"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js encontrado: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js não encontrado. Instale Node.js 18+ de https://nodejs.org${NC}"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm encontrado: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm não encontrado${NC}"
    exit 1
fi

echo ""

# ═════════════════════════════════════════════════════════════
# Limpeza (opcional)
# ═════════════════════════════════════════════════════════════
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}Limpando builds anteriores...${NC}"

    rm -rf backend/dist
    rm -rf backend/node_modules
    rm -rf frontend/dist
    rm -rf frontend/node_modules
    rm -rf dist

    echo -e "${GREEN}✓ Limpeza concluída${NC}"
    echo ""
fi

# ═════════════════════════════════════════════════════════════
# Build do Backend
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}PASSO 1/3: Compilando Backend (TypeScript)${NC}"
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"

cd backend

echo -e "${YELLOW}Instalando dependências do backend...${NC}"
npm install

echo -e "${YELLOW}Compilando TypeScript...${NC}"
npm run build

echo -e "${GREEN}✓ Backend compilado com sucesso${NC}"
cd ..
echo ""

# ═════════════════════════════════════════════════════════════
# Build do Frontend
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}PASSO 2/3: Compilando Frontend (React + Vite)${NC}"
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"

cd frontend

echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
npm install

echo -e "${YELLOW}Criando build de produção...${NC}"
npm run build

echo -e "${GREEN}✓ Frontend compilado com sucesso${NC}"
cd ..
echo ""

# ═════════════════════════════════════════════════════════════
# Criar pacote distribuível
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}PASSO 3/3: Criando Pacote Distribuível${NC}"
echo -e "${CYAN}──────────────────────────────────────────────────────────────${NC}"

DIST_DIR="dist"
PACKAGE_NAME="StudyNotebook-Linux-v1.1.0"
PACKAGE_DIR="$DIST_DIR/$PACKAGE_NAME"

# Criar estrutura de diretórios
echo -e "${YELLOW}Criando estrutura de diretórios...${NC}"
mkdir -p "$PACKAGE_DIR/backend"
mkdir -p "$PACKAGE_DIR/frontend"
mkdir -p "$PACKAGE_DIR/database"
mkdir -p "$PACKAGE_DIR/uploads"

# Copiar backend
echo -e "${YELLOW}Copiando backend compilado...${NC}"
cp -r backend/dist "$PACKAGE_DIR/backend/"
cp -r backend/node_modules "$PACKAGE_DIR/backend/"
cp backend/package.json "$PACKAGE_DIR/backend/"
cp backend/package-lock.json "$PACKAGE_DIR/backend/"
cp backend/.env.example "$PACKAGE_DIR/backend/.env"

# Copiar frontend
echo -e "${YELLOW}Copiando frontend compilado...${NC}"
cp -r frontend/dist "$PACKAGE_DIR/frontend/"

# Criar scripts de execução
echo -e "${YELLOW}Criando scripts de execução...${NC}"

# Script start.sh
cat > "$PACKAGE_DIR/start.sh" << 'EOF'
#!/bin/bash
echo "═══════════════════════════════════════════════════════════════"
echo "    STUDY NOTEBOOK - Iniciando Servidor"
echo "═══════════════════════════════════════════════════════════════"
echo ""

cd backend
echo "Iniciando backend em http://localhost:3001..."
node dist/index.js
EOF
chmod +x "$PACKAGE_DIR/start.sh"

# Script install.sh
cat > "$PACKAGE_DIR/install.sh" << 'EOF'
#!/bin/bash
# Instala o Study Notebook como serviço systemd (Linux)

echo "═══════════════════════════════════════════════════════════════"
echo "    STUDY NOTEBOOK - Instalação como Serviço"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo "Por favor, execute com sudo:"
    echo "  sudo ./install.sh"
    exit 1
fi

# Criar arquivo de serviço systemd
INSTALL_DIR=$(pwd)
SERVICE_FILE="/etc/systemd/system/study-notebook.service"

cat > "$SERVICE_FILE" << SERVICEEOF
[Unit]
Description=Study Notebook - AI-powered study management
After=network.target

[Service]
Type=simple
User=$SUDO_USER
WorkingDirectory=$INSTALL_DIR/backend
ExecStart=/usr/bin/node $INSTALL_DIR/backend/dist/index.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Recarregar systemd
systemctl daemon-reload

# Habilitar e iniciar serviço
systemctl enable study-notebook
systemctl start study-notebook

echo ""
echo "✓ Study Notebook instalado como serviço!"
echo ""
echo "Comandos úteis:"
echo "  sudo systemctl status study-notebook   # Ver status"
echo "  sudo systemctl stop study-notebook     # Parar"
echo "  sudo systemctl start study-notebook    # Iniciar"
echo "  sudo systemctl restart study-notebook  # Reiniciar"
echo ""
echo "Acesse: http://localhost:3001"
EOF
chmod +x "$PACKAGE_DIR/install.sh"

# README
cat > "$PACKAGE_DIR/README.txt" << 'EOF'
═══════════════════════════════════════════════════════════════
STUDY NOTEBOOK - v1.1.0
═══════════════════════════════════════════════════════════════

INSTALAÇÃO:
1. Certifique-se de ter Node.js 18+ instalado
   Download: https://nodejs.org

2. Execute ./start.sh para iniciar o servidor

3. Abra seu navegador em:
   http://localhost:3001

INSTALAÇÃO COMO SERVIÇO (Linux):
  sudo ./install.sh

ESTRUTURA:
- backend/       → Servidor Node.js + Express
- frontend/      → Interface React (já compilada)
- database/      → Banco de dados SQLite
- uploads/       → Arquivos enviados (PDFs, etc)

SCRIPTS:
- start.sh       → Inicia servidor
- install.sh     → Instala como serviço systemd (requer sudo)

DADOS:
- Banco de dados: database/database.sqlite
- Uploads: uploads/

SUPORTE:
- GitHub: https://github.com/seu-usuario/study-notebook
- Documentação: Ver RELATORIO_VALIDACAO.md

═══════════════════════════════════════════════════════════════
EOF

echo -e "${GREEN}✓ Pacote criado em: $PACKAGE_DIR${NC}"
echo ""

# ═════════════════════════════════════════════════════════════
# Compactar em TAR.GZ
# ═════════════════════════════════════════════════════════════
echo -e "${YELLOW}Compactando pacote...${NC}"

TAR_FILE="$DIST_DIR/$PACKAGE_NAME.tar.gz"
tar -czf "$TAR_FILE" -C "$DIST_DIR" "$PACKAGE_NAME"

TAR_SIZE=$(du -h "$TAR_FILE" | cut -f1)
echo -e "${GREEN}✓ Pacote compactado: $TAR_FILE ($TAR_SIZE)${NC}"
echo ""

# ═════════════════════════════════════════════════════════════
# Resumo
# ═════════════════════════════════════════════════════════════
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    BUILD CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Arquivos gerados:${NC}"
echo "  - Pasta: $PACKAGE_DIR"
echo "  - TAR:   $TAR_FILE"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "  1. Descompacte o arquivo:"
echo "     tar -xzf $TAR_FILE"
echo "  2. Entre na pasta:"
echo "     cd $PACKAGE_NAME"
echo "  3. Execute:"
echo "     ./start.sh"
echo "  4. Acesse http://localhost:3001 no navegador"
echo ""
