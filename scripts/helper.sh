#!/bin/bash

# Study Notebook - Helper Script
# Funções auxiliares para desenvolvimento e manutenção

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Menu principal
show_menu() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "  Study Notebook - Helper Menu"
    echo "═══════════════════════════════════════════════"
    echo ""
    echo "  Desenvolvimento:"
    echo "    1) Setup completo do projeto"
    echo "    2) Iniciar desenvolvimento (backend + frontend)"
    echo "    3) Build para produção"
    echo ""
    echo "  Banco de Dados:"
    echo "    4) Popular com dados de exemplo"
    echo "    5) Ver estatísticas do banco"
    echo "    6) Resetar banco de dados"
    echo "    7) Criar backup"
    echo "    8) Console SQLite"
    echo ""
    echo "  Testes:"
    echo "    9) Health check completo"
    echo "   10) Testar API de Spaces"
    echo "   11) Testar llama.cpp"
    echo ""
    echo "  Outros:"
    echo "   12) Atualizar dependências"
    echo "   13) Lint completo"
    echo "    0) Sair"
    echo ""
    echo "═══════════════════════════════════════════════"
}

# 1. Setup do projeto
setup_project() {
    log_info "Instalando dependências do backend..."
    cd "$PROJECT_DIR/backend" && npm install

    log_info "Instalando dependências do frontend..."
    cd "$PROJECT_DIR/frontend" && npm install

    log_success "Projeto configurado com sucesso!"
}

# 2. Iniciar desenvolvimento
start_dev() {
    log_info "Iniciando servidores de desenvolvimento..."

    # Criar script temporário para rodar ambos
    cat > /tmp/start_dev.sh <<'EOF'
#!/bin/bash
trap 'kill 0' SIGINT

cd backend && npm run dev &
cd frontend && npm run dev &

wait
EOF

    chmod +x /tmp/start_dev.sh
    cd "$PROJECT_DIR" && /tmp/start_dev.sh
}

# 3. Build
build_all() {
    log_info "Building backend..."
    cd "$PROJECT_DIR/backend" && npm run build

    log_info "Building frontend..."
    cd "$PROJECT_DIR/frontend" && npm run build

    log_success "Build completo!"
}

# 4. Popular dados de exemplo
populate_test_data() {
    log_info "Criando dados de exemplo..."

    DB_PATH="$PROJECT_DIR/backend/database.sqlite"

    # Verificar se banco existe, senão criar
    if [ ! -f "$DB_PATH" ]; then
        log_warning "Banco não encontrado. Inicie o backend primeiro para criar as tabelas."
        return 1
    fi

    sqlite3 "$DB_PATH" <<'EOF'
-- Limpar dados existentes (mas manter estrutura)
DELETE FROM notes;
DELETE FROM notebooks;
DELETE FROM stacks;
DELETE FROM spaces;

-- MEDICINA
INSERT INTO spaces (name, color) VALUES ('Medicina', '#ef4444');
INSERT INTO stacks (name, space_id) VALUES
  ('Anatomia', 1),
  ('Cardiologia', 1),
  ('Neurologia', 1);
INSERT INTO notebooks (name, stack_id) VALUES
  ('Geral', 1),
  ('Sistema Cardiovascular', 1),
  ('IAM', 2),
  ('Arritmias', 2);
INSERT INTO notes (title, content, notebook_id) VALUES
  ('Introdução', '<h1>Anatomia Humana</h1><p>Estudo das estruturas do corpo humano.</p>', 1),
  ('IAMCEST', '<h1>Infarto Agudo do Miocárdio</h1><p>Emergência que requer tratamento imediato.</p><h2>Critérios</h2><ul><li>Dor precordial</li><li>Supra de ST</li><li>Troponina elevada</li></ul>', 3);

-- TECNOLOGIA
INSERT INTO spaces (name, color) VALUES ('Tecnologia', '#3b82f6');
INSERT INTO stacks (name, space_id) VALUES
  ('Programação', 2),
  ('DevOps', 2),
  ('IA & ML', 2);
INSERT INTO notebooks (name, stack_id) VALUES
  ('JavaScript', 3),
  ('Python', 3),
  ('React', 3),
  ('Docker', 4),
  ('Machine Learning', 5);
INSERT INTO notes (title, content, notebook_id) VALUES
  ('React Hooks', '<h1>React Hooks</h1><p>Hooks são funções que permitem usar state em componentes funcionais.</p><ul><li>useState</li><li>useEffect</li><li>useContext</li></ul>', 5),
  ('Docker Compose', '<h1>Docker Compose</h1><pre><code>version: "3.8"\nservices:\n  web:\n    image: nginx\n    ports:\n      - "80:80"</code></pre>', 6);

-- IDIOMAS
INSERT INTO spaces (name, color) VALUES ('Idiomas', '#10b981');
INSERT INTO stacks (name, space_id) VALUES
  ('Inglês', 3),
  ('Espanhol', 3),
  ('Francês', 3);
INSERT INTO notebooks (name, stack_id) VALUES
  ('Vocabulário', 6),
  ('Gramática', 6),
  ('Básico', 7);
INSERT INTO notes (title, content, notebook_id) VALUES
  ('Phrasal Verbs', '<h1>Common Phrasal Verbs</h1><ul><li>Look up - procurar</li><li>Give up - desistir</li><li>Take off - decolar</li></ul>', 7),
  ('Saludos', '<h1>Saudações em Espanhol</h1><ul><li>Hola - Olá</li><li>Buenos días - Bom dia</li><li>¿Cómo estás? - Como está?</li></ul>', 9);

-- PROJETOS PESSOAIS
INSERT INTO spaces (name, color) VALUES ('Projetos Pessoais', '#f59e0b');
INSERT INTO stacks (name, space_id) VALUES
  ('Casa', 4),
  ('Finanças', 4),
  ('Viagens', 4);
INSERT INTO notebooks (name, stack_id) VALUES
  ('Reformas', 10),
  ('Investimentos', 11),
  ('Europa 2024', 12);
INSERT INTO notes (title, content, notebook_id) VALUES
  ('Orçamento Cozinha', '<h1>Reforma da Cozinha</h1><h2>Orçamentos</h2><ul><li>Marceneiro: R$ 5.000</li><li>Eletricista: R$ 1.500</li><li>Material: R$ 3.000</li></ul>', 10),
  ('Roteiro Paris', '<h1>Paris - 5 dias</h1><h2>Dia 1</h2><ul><li>Torre Eiffel</li><li>Champs-Élysées</li></ul><h2>Dia 2</h2><ul><li>Louvre</li><li>Notre-Dame</li></ul>', 11);

-- FITNESS & SAÚDE
INSERT INTO spaces (name, color) VALUES ('Fitness & Saúde', '#8b5cf6');
INSERT INTO stacks (name, space_id) VALUES
  ('Treinos', 5),
  ('Nutrição', 5),
  ('Meditação', 5);
INSERT INTO notebooks (name, stack_id) VALUES
  ('Treino A', 13),
  ('Dieta', 14),
  ('Mindfulness', 15);
INSERT INTO notes (title, content, notebook_id) VALUES
  ('Treino Peito/Tríceps', '<h1>Treino A - Peito e Tríceps</h1><ul><li>Supino reto: 4x10</li><li>Supino inclinado: 3x12</li><li>Crucifixo: 3x12</li><li>Tríceps pulley: 3x15</li></ul>', 12),
  ('Plano Alimentar', '<h1>Dieta 2000 kcal</h1><h2>Café</h2><p>Ovos, pão integral, café</p><h2>Almoço</h2><p>Frango, arroz, feijão, salada</p>', 13);
EOF

    log_success "Dados de exemplo criados!"
    echo ""
    log_info "Estrutura criada:"
    echo "  📁 Medicina (Anatomia, Cardiologia, Neurologia)"
    echo "  📁 Tecnologia (Programação, DevOps, IA & ML)"
    echo "  📁 Idiomas (Inglês, Espanhol, Francês)"
    echo "  📁 Projetos Pessoais (Casa, Finanças, Viagens)"
    echo "  📁 Fitness & Saúde (Treinos, Nutrição, Meditação)"
}

# 5. Estatísticas do banco
db_stats() {
    DB_PATH="$PROJECT_DIR/backend/database.sqlite"

    if [ ! -f "$DB_PATH" ]; then
        log_error "Banco de dados não encontrado!"
        return 1
    fi

    echo ""
    log_info "Estatísticas do Banco de Dados:"
    echo ""
    sqlite3 "$DB_PATH" <<'EOF'
.mode column
.headers on
SELECT 'Spaces' as Tipo, COUNT(*) as Total FROM spaces
UNION ALL
SELECT 'Stacks', COUNT(*) FROM stacks
UNION ALL
SELECT 'Notebooks', COUNT(*) FROM notebooks
UNION ALL
SELECT 'Notes', COUNT(*) FROM notes;

SELECT '';
SELECT '═══ Detalhes por Space ═══' as '';
SELECT s.name as Space, COUNT(DISTINCT st.id) as Stacks, COUNT(DISTINCT n.id) as Notebooks, COUNT(DISTINCT nt.id) as Notes
FROM spaces s
LEFT JOIN stacks st ON st.space_id = s.id
LEFT JOIN notebooks n ON n.stack_id = st.id
LEFT JOIN notes nt ON nt.notebook_id = n.id
GROUP BY s.id, s.name;
EOF
}

# 6. Resetar banco
reset_database() {
    read -p "⚠️  Tem certeza que deseja resetar o banco? (s/N): " confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        rm -f "$PROJECT_DIR/backend/database.sqlite"
        log_success "Banco de dados resetado!"
        log_warning "Reinicie o backend para recriar as tabelas."
    else
        log_info "Operação cancelada."
    fi
}

# 7. Backup
backup_database() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="$PROJECT_DIR/backups"
    BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sqlite"

    mkdir -p "$BACKUP_DIR"

    if [ -f "$PROJECT_DIR/backend/database.sqlite" ]; then
        cp "$PROJECT_DIR/backend/database.sqlite" "$BACKUP_FILE"
        log_success "Backup criado: backups/backup_${TIMESTAMP}.sqlite"
    else
        log_error "Banco de dados não encontrado!"
    fi
}

# 8. Console SQLite
db_console() {
    if [ -f "$PROJECT_DIR/backend/database.sqlite" ]; then
        sqlite3 "$PROJECT_DIR/backend/database.sqlite"
    else
        log_error "Banco de dados não encontrado!"
    fi
}

# 9. Health check
health_check() {
    echo ""
    log_info "Verificando saúde do sistema..."
    echo ""

    # Backend
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        log_success "Backend rodando em http://localhost:3001"
    else
        log_error "Backend offline"
    fi

    # Frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend rodando em http://localhost:3000"
    else
        log_error "Frontend offline"
    fi

    # Database
    if [ -f "$PROJECT_DIR/backend/database.sqlite" ]; then
        log_success "Banco de dados existe"
    else
        log_warning "Banco de dados não encontrado"
    fi

    # llama.cpp (opcional)
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        log_success "llama.cpp disponível"
    else
        log_warning "llama.cpp offline (opcional)"
    fi

    echo ""
}

# 10. Testar API
test_api() {
    log_info "Testando API de Spaces..."

    # Criar space
    RESPONSE=$(curl -s -X POST http://localhost:3001/api/spaces \
      -H "Content-Type: application/json" \
      -d '{"name":"Teste API","color":"#9333ea"}')

    if [ $? -eq 0 ]; then
        log_success "Space criado com sucesso!"
        echo "$RESPONSE" | jq 2>/dev/null || echo "$RESPONSE"
    else
        log_error "Falha ao criar space"
    fi
}

# 11. Testar llama.cpp
test_llama() {
    log_info "Verificando llama.cpp..."

    RESPONSE=$(curl -s http://localhost:3001/api/ai/llama/health)

    if echo "$RESPONSE" | grep -q "true"; then
        log_success "llama.cpp está online!"
    else
        log_warning "llama.cpp está offline"
        log_info "Para usar llama.cpp, inicie o servidor com:"
        echo "  ./server -m models/your-model.gguf --port 8080"
    fi
}

# 12. Atualizar dependências
update_dependencies() {
    log_info "Atualizando dependências do backend..."
    cd "$PROJECT_DIR/backend" && npm update

    log_info "Atualizando dependências do frontend..."
    cd "$PROJECT_DIR/frontend" && npm update

    log_success "Dependências atualizadas!"
}

# 13. Lint
lint_all() {
    log_info "Verificando tipos no backend..."
    cd "$PROJECT_DIR/backend" && npx tsc --noEmit

    log_info "Verificando tipos no frontend..."
    cd "$PROJECT_DIR/frontend" && npx tsc --noEmit

    log_success "Lint completo!"
}

# Menu interativo
interactive_menu() {
    while true; do
        show_menu
        read -p "Escolha uma opção: " choice

        case $choice in
            1) setup_project ;;
            2) start_dev ;;
            3) build_all ;;
            4) populate_test_data ;;
            5) db_stats ;;
            6) reset_database ;;
            7) backup_database ;;
            8) db_console ;;
            9) health_check ;;
            10) test_api ;;
            11) test_llama ;;
            12) update_dependencies ;;
            13) lint_all ;;
            0)
                log_info "Até logo!"
                exit 0
                ;;
            *)
                log_error "Opção inválida!"
                ;;
        esac

        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Main
if [ $# -eq 0 ]; then
    interactive_menu
else
    # Permitir chamadas diretas: ./helper.sh setup_project
    "$@"
fi
