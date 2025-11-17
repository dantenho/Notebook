# Agent Helper Functions - Study Notebook

Funções auxiliares para desenvolvimento, testes e manutenção do Study Notebook.

## Funções de Desenvolvimento

### 1. Setup Completo do Projeto

```bash
# Instalar dependências backend e frontend
setup_project() {
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install

    echo "📦 Instalando dependências do frontend..."
    cd ../frontend && npm install

    echo "✅ Projeto configurado com sucesso!"
    cd ..
}
```

### 2. Iniciar Desenvolvimento

```bash
# Iniciar backend e frontend simultaneamente
start_dev() {
    echo "🚀 Iniciando backend..."
    cd backend && npm run dev &
    BACKEND_PID=$!

    echo "🚀 Iniciando frontend..."
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!

    echo "✅ Servidores rodando!"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "Backend: http://localhost:3001"
    echo "Frontend: http://localhost:3000"

    # Esperar por Ctrl+C
    wait
}
```

### 3. Build para Produção

```bash
# Build completo
build_all() {
    echo "🏗️  Building backend..."
    cd backend && npm run build

    echo "🏗️  Building frontend..."
    cd ../frontend && npm run build

    echo "✅ Build completo!"
}
```

## Funções de Testes e Dados

### 4. Popular Banco de Dados com Dados de Exemplo

```bash
# Criar dados de exemplo para testes
populate_test_data() {
    echo "📝 Populando banco de dados com dados de exemplo..."

    # Criar script SQL temporário
    cat > /tmp/test_data.sql <<'EOF'
-- Limpar dados existentes
DELETE FROM notes;
DELETE FROM notebooks;
DELETE FROM stacks;
DELETE FROM spaces;

-- Criar Spaces de exemplo
INSERT INTO spaces (name, color) VALUES
  ('Medicina', '#ef4444'),
  ('Tecnologia', '#3b82f6'),
  ('Idiomas', '#10b981'),
  ('Projetos Pessoais', '#f59e0b');

-- Criar Stacks para Medicina
INSERT INTO stacks (name, space_id) VALUES
  ('Anatomia', 1),
  ('Cardiologia', 1),
  ('Neurologia', 1);

-- Criar Stacks para Tecnologia
INSERT INTO stacks (name, space_id) VALUES
  ('Programação', 2),
  ('DevOps', 2),
  ('IA & ML', 2);

-- Criar Stacks para Idiomas
INSERT INTO stacks (name, space_id) VALUES
  ('Inglês', 3),
  ('Espanhol', 3);

-- Criar Notebooks para Anatomia
INSERT INTO notebooks (name, stack_id) VALUES
  ('Geral', 1),
  ('Sistema Cardiovascular', 1);

-- Criar Notebooks para Cardiologia
INSERT INTO notebooks (name, stack_id) VALUES
  ('IAM', 2),
  ('Arritmias', 2),
  ('Insuficiência Cardíaca', 2);

-- Criar Notebooks para Programação
INSERT INTO notebooks (name, stack_id) VALUES
  ('JavaScript', 4),
  ('Python', 4),
  ('React', 4);

-- Criar Notes de exemplo
INSERT INTO notes (title, content, notebook_id) VALUES
  ('Introdução à Anatomia', '<h1>Anatomia Humana</h1><p>A anatomia é a ciência que estuda a estrutura do corpo humano.</p>', 1),
  ('IAMCEST', '<h1>Infarto Agudo do Miocárdio com Supra de ST</h1><p>O IAMCEST é uma emergência médica que requer tratamento imediato.</p><h2>Critérios Diagnósticos</h2><ul><li>Dor precordial típica</li><li>Elevação do segmento ST</li><li>Marcadores cardíacos elevados</li></ul>', 3),
  ('Fundamentos do React', '<h1>React Basics</h1><p>React é uma biblioteca JavaScript para construir interfaces de usuário.</p><h2>Conceitos Principais</h2><ul><li>Componentes</li><li>Props</li><li>State</li><li>Hooks</li></ul>', 7),
  ('Diagrama de Fluxo', '<h1>Exemplo de Mermaid</h1><p>Diagrama de fluxo de atendimento cardíaco:</p><pre><code class="language-mermaid">graph TD\n    A[Paciente com Dor Torácica] --> B{ECG}\n    B -->|Supra de ST| C[IAMCEST]\n    B -->|Sem Supra| D[IAMSEST]\n    C --> E[Reperfusão Imediata]\n    D --> F[Estratificação de Risco]</code></pre>', 3);
EOF

    sqlite3 backend/database.sqlite < /tmp/test_data.sql
    rm /tmp/test_data.sql

    echo "✅ Dados de exemplo criados!"
    echo ""
    echo "Estrutura criada:"
    echo "📁 Medicina"
    echo "  📚 Anatomia"
    echo "    📓 Geral"
    echo "    📓 Sistema Cardiovascular"
    echo "  📚 Cardiologia"
    echo "    📓 IAM"
    echo "    📓 Arritmias"
    echo ""
    echo "📁 Tecnologia"
    echo "  📚 Programação"
    echo "    📓 JavaScript"
    echo "    📓 Python"
    echo "    📓 React"
    echo ""
    echo "📁 Idiomas"
    echo "  📚 Inglês"
    echo "  📚 Espanhol"
    echo ""
    echo "📁 Projetos Pessoais"
}
```

### 5. Limpar Banco de Dados

```bash
# Resetar banco de dados
reset_database() {
    echo "⚠️  Resetando banco de dados..."
    rm -f backend/database.sqlite
    echo "✅ Banco de dados limpo!"
    echo "🔄 Reinicie o backend para recriar as tabelas."
}
```

### 6. Backup do Banco de Dados

```bash
# Criar backup
backup_database() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_${TIMESTAMP}.sqlite"

    if [ -f backend/database.sqlite ]; then
        cp backend/database.sqlite "backups/${BACKUP_FILE}"
        echo "✅ Backup criado: backups/${BACKUP_FILE}"
    else
        echo "❌ Banco de dados não encontrado!"
    fi
}

# Restaurar backup
restore_database() {
    if [ -z "$1" ]; then
        echo "❌ Especifique o arquivo de backup!"
        echo "Uso: restore_database <arquivo>"
        ls backups/
        return 1
    fi

    if [ -f "backups/$1" ]; then
        cp "backups/$1" backend/database.sqlite
        echo "✅ Backup restaurado: $1"
    else
        echo "❌ Arquivo não encontrado!"
    fi
}
```

## Funções de Testes de API

### 7. Testar Endpoints da API

```bash
# Testar criação de Space
test_create_space() {
    echo "🧪 Testando criação de Space..."
    curl -X POST http://localhost:3001/api/spaces \
      -H "Content-Type: application/json" \
      -d '{"name":"Teste Space","color":"#9333ea"}'
    echo ""
}

# Testar criação de Stack
test_create_stack() {
    echo "🧪 Testando criação de Stack..."
    curl -X POST http://localhost:3001/api/stacks \
      -H "Content-Type: application/json" \
      -d '{"name":"Teste Stack","space_id":1}'
    echo ""
}

# Testar criação de Notebook
test_create_notebook() {
    echo "🧪 Testando criação de Notebook..."
    curl -X POST http://localhost:3001/api/notebooks \
      -H "Content-Type: application/json" \
      -d '{"name":"Teste Notebook","stack_id":1}'
    echo ""
}

# Testar criação de Note
test_create_note() {
    echo "🧪 Testando criação de Note..."
    curl -X POST http://localhost:3001/api/notes \
      -H "Content-Type: application/json" \
      -d '{"title":"Teste Note","content":"<p>Conteúdo de teste</p>","notebook_id":1}'
    echo ""
}

# Listar todos os Spaces
test_list_spaces() {
    echo "📋 Listando Spaces..."
    curl http://localhost:3001/api/spaces | jq
}
```

### 8. Testar IA (Claude)

```bash
# Testar geração com Claude
test_ai_claude() {
    API_KEY="$1"

    if [ -z "$API_KEY" ]; then
        echo "❌ Especifique sua API key!"
        echo "Uso: test_ai_claude <api_key>"
        return 1
    fi

    echo "🧪 Testando geração com Claude..."
    curl -X POST http://localhost:3001/api/ai/generate \
      -H "Content-Type: application/json" \
      -d "{
        \"provider\": \"anthropic\",
        \"model\": \"claude-3-5-sonnet-20241022\",
        \"apiKey\": \"$API_KEY\",
        \"prompt\": \"Explique o que é IAMCEST em 3 linhas\",
        \"thinking\": true
      }" | jq
}

# Testar geração com llama.cpp
test_ai_llama() {
    echo "🧪 Testando geração com llama.cpp..."
    curl -X POST http://localhost:3001/api/ai/generate \
      -H "Content-Type: application/json" \
      -d '{
        "provider": "llama.cpp",
        "model": "local",
        "prompt": "Explique o que é React em 2 linhas"
      }' | jq
}

# Verificar saúde do llama.cpp
test_llama_health() {
    echo "🏥 Verificando llama.cpp..."
    curl http://localhost:3001/api/ai/llama/health | jq
}
```

## Funções de Desenvolvimento Frontend

### 9. Adicionar Novo Componente

```bash
# Criar novo componente React
create_component() {
    COMPONENT_NAME="$1"

    if [ -z "$COMPONENT_NAME" ]; then
        echo "❌ Especifique o nome do componente!"
        echo "Uso: create_component <ComponentName>"
        return 1
    fi

    FILE_PATH="frontend/src/components/${COMPONENT_NAME}.tsx"

    cat > "$FILE_PATH" <<EOF
interface ${COMPONENT_NAME}Props {
  // Props aqui
}

export default function ${COMPONENT_NAME}({}: ${COMPONENT_NAME}Props) {
  return (
    <div className="">
      <h1>${COMPONENT_NAME}</h1>
    </div>
  );
}
EOF

    echo "✅ Componente criado: $FILE_PATH"
}
```

### 10. Adicionar Nova Página

```bash
# Criar nova página React
create_page() {
    PAGE_NAME="$1"

    if [ -z "$PAGE_NAME" ]; then
        echo "❌ Especifique o nome da página!"
        echo "Uso: create_page <PageName>"
        return 1
    fi

    FILE_PATH="frontend/src/pages/${PAGE_NAME}.tsx"

    cat > "$FILE_PATH" <<EOF
export default function ${PAGE_NAME}() {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">${PAGE_NAME}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Conteúdo aqui */}
      </div>
    </div>
  );
}
EOF

    echo "✅ Página criada: $FILE_PATH"
}
```

## Funções de Manutenção

### 11. Verificar Logs

```bash
# Ver logs do backend
view_backend_logs() {
    tail -f backend/logs/*.log 2>/dev/null || echo "Nenhum log encontrado"
}

# Limpar logs antigos
clean_logs() {
    rm -f backend/logs/*.log
    echo "✅ Logs limpos!"
}
```

### 12. Verificar Saúde do Sistema

```bash
# Health check completo
health_check() {
    echo "🏥 Verificando saúde do sistema..."
    echo ""

    echo "📡 Backend:"
    curl -s http://localhost:3001/api/health | jq || echo "❌ Backend offline"
    echo ""

    echo "📡 Frontend:"
    curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend online" || echo "❌ Frontend offline"
    echo ""

    echo "💾 Banco de dados:"
    [ -f backend/database.sqlite ] && echo "✅ Database existe" || echo "❌ Database não encontrado"
    echo ""

    echo "🤖 llama.cpp:"
    curl -s http://localhost:8080/health > /dev/null && echo "✅ llama.cpp online" || echo "⚠️  llama.cpp offline (opcional)"
}
```

### 13. Atualizar Dependências

```bash
# Atualizar todas as dependências
update_dependencies() {
    echo "📦 Atualizando dependências do backend..."
    cd backend && npm update

    echo "📦 Atualizando dependências do frontend..."
    cd ../frontend && npm update

    echo "✅ Dependências atualizadas!"
    cd ..
}
```

## Funções de Debug

### 14. Debug do Banco de Dados

```bash
# Abrir console do SQLite
db_console() {
    if [ -f backend/database.sqlite ]; then
        sqlite3 backend/database.sqlite
    else
        echo "❌ Banco de dados não encontrado!"
    fi
}

# Ver estatísticas do banco
db_stats() {
    echo "📊 Estatísticas do Banco de Dados:"
    echo ""

    sqlite3 backend/database.sqlite <<EOF
SELECT 'Spaces: ' || COUNT(*) FROM spaces;
SELECT 'Stacks: ' || COUNT(*) FROM stacks;
SELECT 'Notebooks: ' || COUNT(*) FROM notebooks;
SELECT 'Notes: ' || COUNT(*) FROM notes;
EOF
}

# Ver estrutura das tabelas
db_schema() {
    echo "🗂️  Schema do Banco de Dados:"
    sqlite3 backend/database.sqlite ".schema"
}
```

### 15. Monitorar Requisições

```bash
# Monitorar requisições HTTP (requer httpry ou similar)
monitor_requests() {
    echo "👀 Monitorando requisições..."
    echo "Pressione Ctrl+C para parar"
    tcpdump -i lo -A 'tcp port 3001' 2>/dev/null || echo "❌ Requer tcpdump instalado"
}
```

## Funções de Qualidade de Código

### 16. Lint e Format

```bash
# Executar linter no backend
lint_backend() {
    echo "🔍 Linting backend..."
    cd backend && npx tsc --noEmit
    cd ..
}

# Executar linter no frontend
lint_frontend() {
    echo "🔍 Linting frontend..."
    cd frontend && npx tsc --noEmit
    cd ..
}

# Lint completo
lint_all() {
    lint_backend
    lint_frontend
}
```

## Uso Rápido

```bash
# Source este arquivo para usar as funções:
source agent.md

# Ou crie aliases em ~/.bashrc:
alias nb-setup='setup_project'
alias nb-dev='start_dev'
alias nb-build='build_all'
alias nb-test='populate_test_data'
alias nb-health='health_check'
alias nb-stats='db_stats'
```

## Exemplos de Uso

```bash
# Setup inicial
setup_project

# Popular com dados de teste
populate_test_data

# Iniciar desenvolvimento
start_dev

# Ver estatísticas
db_stats

# Criar backup
mkdir -p backups
backup_database

# Health check
health_check

# Testar API
test_create_space
test_list_spaces

# Testar IA
test_ai_claude "sua-api-key-aqui"
test_llama_health
```

## Notas

- Todas as funções assumem que você está no diretório raiz do projeto
- Algumas funções requerem ferramentas como `jq`, `sqlite3`, `curl`
- Para usar llama.cpp, inicie o servidor separadamente
- API keys devem ser mantidas seguras e nunca commitadas
