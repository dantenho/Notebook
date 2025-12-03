#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Script de Instalação Rápida - Study Notebook
# ═══════════════════════════════════════════════════════════════
#
# Instalação rápida com um comando:
#   curl -fsSL https://raw.githubusercontent.com/user/repo/main/quick-install.sh | bash
#
# Ou baixe e execute:
#   ./quick-install.sh
#

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         ███████╗████████╗██╗   ██╗██████╗ ██╗   ██╗        ║
║         ██╔════╝╚══██╔══╝██║   ██║██╔══██╗╚██╗ ██╔╝        ║
║         ███████╗   ██║   ██║   ██║██║  ██║ ╚████╔╝         ║
║         ╚════██║   ██║   ██║   ██║██║  ██║  ╚██╔╝          ║
║         ███████║   ██║   ╚██████╔╝██████╔╝   ██║           ║
║         ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝    ╚═╝           ║
║                                                              ║
║         NOTEBOOK - AI-Powered Study Management               ║
║                    v1.1.0                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${YELLOW}Instalação Rápida - Study Notebook${NC}\n"

# ═════════════════════════════════════════════════════════════
# Verificar requisitos
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/5] Verificando requisitos...${NC}"

# Detectar OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
else
    OS="Unknown"
fi
echo -e "  ${GREEN}✓${NC} Sistema operacional: $OS"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "  ${RED}✗${NC} Node.js não encontrado"
    echo -e "\n${YELLOW}Instalando Node.js...${NC}\n"

    if [[ "$OS" == "Linux" ]]; then
        # Linux - usar NodeSource
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == "macOS" ]]; then
        # macOS - usar Homebrew
        if command -v brew &> /dev/null; then
            brew install node@18
        else
            echo -e "${RED}Por favor, instale Homebrew primeiro: https://brew.sh${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Sistema não suportado. Por favor, instale Node.js manualmente: https://nodejs.org${NC}"
        exit 1
    fi

    echo -e "  ${GREEN}✓${NC} Node.js instalado com sucesso"
fi

# Verificar Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "  ${GREEN}✓${NC} Git: $GIT_VERSION"
else
    echo -e "  ${YELLOW}⚠${NC} Git não encontrado (opcional)"
fi

echo ""

# ═════════════════════════════════════════════════════════════
# Criar diretório de instalação
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/5] Preparando instalação...${NC}"

INSTALL_DIR="$HOME/study-notebook"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "  ${YELLOW}⚠${NC} Diretório $INSTALL_DIR já existe"
    read -p "  Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "  ${RED}Instalação cancelada${NC}"
        exit 1
    fi
    rm -rf "$INSTALL_DIR"
fi

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo -e "  ${GREEN}✓${NC} Diretório criado: $INSTALL_DIR"
echo ""

# ═════════════════════════════════════════════════════════════
# Download do código
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/5] Baixando Study Notebook...${NC}"

if command -v git &> /dev/null; then
    # Clone do repositório
    git clone https://github.com/seu-usuario/study-notebook.git .
    echo -e "  ${GREEN}✓${NC} Código baixado via Git"
else
    # Download do ZIP
    echo -e "  ${YELLOW}Baixando ZIP...${NC}"
    curl -L https://github.com/seu-usuario/study-notebook/archive/refs/heads/main.zip -o study-notebook.zip
    unzip -q study-notebook.zip
    mv study-notebook-main/* .
    rm -rf study-notebook-main study-notebook.zip
    echo -e "  ${GREEN}✓${NC} Código baixado via ZIP"
fi

echo ""

# ═════════════════════════════════════════════════════════════
# Instalar dependências
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/5] Instalando dependências...${NC}"

# Backend
echo -e "  ${YELLOW}Backend...${NC}"
cd backend
npm install --silent
npm run build > /dev/null 2>&1
echo -e "  ${GREEN}✓${NC} Backend instalado e compilado"

# Frontend
cd ../frontend
echo -e "  ${YELLOW}Frontend...${NC}"
npm install --silent
npm run build > /dev/null 2>&1
echo -e "  ${GREEN}✓${NC} Frontend instalado e compilado"

cd ..
echo ""

# ═════════════════════════════════════════════════════════════
# Configuração
# ═════════════════════════════════════════════════════════════
echo -e "${CYAN}[5/5] Configurando aplicação...${NC}"

# Criar .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "  ${GREEN}✓${NC} Arquivo .env criado"
fi

# Criar diretórios
mkdir -p backend/database
mkdir -p backend/uploads

# Criar script de inicialização
cat > start.sh << 'STARTEOF'
#!/bin/bash
echo "Iniciando Study Notebook..."
cd backend
node dist/index.js
STARTEOF
chmod +x start.sh

echo -e "  ${GREEN}✓${NC} Configuração concluída"
echo ""

# ═════════════════════════════════════════════════════════════
# Conclusão
# ═════════════════════════════════════════════════════════════
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✓ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Próximos passos:${NC}\n"
echo -e "  1. Entre no diretório:"
echo -e "     ${BLUE}cd $INSTALL_DIR${NC}\n"
echo -e "  2. Inicie o servidor:"
echo -e "     ${BLUE}./start.sh${NC}\n"
echo -e "  3. Abra o navegador:"
echo -e "     ${BLUE}http://localhost:3001${NC}\n"

echo -e "${CYAN}Comandos úteis:${NC}\n"
echo -e "  Iniciar:     ${BLUE}./start.sh${NC}"
echo -e "  Logs:        ${BLUE}tail -f backend/logs/*.log${NC}"
echo -e "  Parar:       ${BLUE}Ctrl+C${NC}\n"

echo -e "${YELLOW}Deseja iniciar o Study Notebook agora? (s/N):${NC} "
read -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "\n${GREEN}Iniciando...${NC}\n"
    ./start.sh
else
    echo -e "\n${CYAN}Para iniciar manualmente, execute:${NC}"
    echo -e "${BLUE}  cd $INSTALL_DIR && ./start.sh${NC}\n"
fi
