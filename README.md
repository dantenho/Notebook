# Study Notebook - Aplicativo de Anotações com IA

Um aplicativo de anotações completo similar ao Evernote, mas com hierarquia de 4 níveis (Spaces > Stacks > Notebooks > Notes) e integração com modelos de IA para edição assistida de texto.

**Organize qualquer tipo de conteúdo**: Medicina, Tecnologia, Idiomas, Projetos Pessoais, Fitness, Estudos, Trabalho, etc!

## Quickstart

```bash
# 1. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 2. Iniciar backend (terminal 1)
cd backend && npm run dev

# 3. Iniciar frontend (terminal 2)
cd frontend && npm run dev

# 4. Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3001

# 5. (Opcional) Popular com dados de exemplo
./scripts/helper.sh populate_test_data
```

## Características

- **Hierarquia de 4 níveis**: Spaces → Stacks → Notebooks → Notes
  - Crie quantos Spaces quiser (Medicina, Tecnologia, Idiomas, etc.)
  - Organize seus conteúdos em Stacks (categorias dentro de cada Space)
  - Subdivida em Notebooks (tópicos específicos)
  - Adicione Notes (suas anotações)
- **Múltiplos cadernos**: Não limitado a um assunto - organize tudo em um só lugar!
- **Editor rico**: Suporte a formatação de texto, tabelas, listas, imagens, código
- **Diagramas Mermaid**: Renderização automática de diagramas com linhas corretas
- **Integração com IA**:
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic Claude (com Extended Thinking)
  - Google Gemini
  - llama.cpp (modelos locais)
- **Chatbox integrado**: Edite o texto atual ou gere novo conteúdo usando IA
- **Auto-save**: Salve suas notas manualmente
- **Interface limpa**: Design inspirado no Evernote

## Estrutura do Projeto

```
/
├── backend/          # API REST (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── db/       # Configuração do banco de dados
│   │   ├── models/   # Models (Space, Stack, Notebook, Note)
│   │   ├── routes/   # Rotas da API
│   │   └── services/ # Serviços de IA
│   └── package.json
├── frontend/         # React + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript types
│   └── package.json
└── README.md
```

## Instalação

### Pré-requisitos

- Node.js 18+ e npm
- (Opcional) llama.cpp rodando em `http://localhost:8080` para modelos locais

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

### 3. Helper Script (Opcional)

Para facilitar o desenvolvimento, use o script auxiliar:

```bash
# Tornar executável (já está)
chmod +x scripts/helper.sh

# Executar menu interativo
./scripts/helper.sh

# Ou usar comandos diretos
./scripts/helper.sh setup_project        # Setup completo
./scripts/helper.sh populate_test_data   # Popular com dados de exemplo
./scripts/helper.sh health_check         # Verificar status
./scripts/helper.sh db_stats             # Ver estatísticas
```

O helper script oferece:
- Setup automático do projeto
- Popular banco com dados de exemplo de múltiplos assuntos
- Testes de API e IA
- Backups e estatísticas do banco
- Health checks completos

## Uso

### Criando a Hierarquia

1. **Criar Space**: Clique em "Novo Space" na sidebar
2. **Criar Stack**: Passe o mouse sobre um Space e clique no ícone `+`
3. **Criar Notebook**: Passe o mouse sobre um Stack e clique no ícone `+`
4. **Criar Note**: Passe o mouse sobre um Notebook e clique no ícone `+`

### Exemplos de Hierarquia

**Organize qualquer tipo de conteúdo:**

```
📁 Medicina (Space)
  📚 Anatomia (Stack)
    📓 Geral (Notebook)
      📄 Introdução (Note)
    📓 Sistema Cardiovascular (Notebook)
      📄 Anatomia do Coração (Note)
  📚 Cardiologia (Stack)
    📓 IAM (Notebook)
      📄 IAMCEST (Note)
      📄 IAMSEST (Note)
    📓 Arritmias (Notebook)

📁 Tecnologia (Space)
  📚 Programação (Stack)
    📓 JavaScript (Notebook)
      📄 ES6+ Features (Note)
      📄 Async/Await (Note)
    📓 React (Notebook)
      📄 Hooks (Note)
  📚 DevOps (Stack)
    📓 Docker (Notebook)
    📓 Kubernetes (Notebook)

📁 Idiomas (Space)
  📚 Inglês (Stack)
    📓 Vocabulário (Notebook)
    📓 Gramática (Notebook)
  📚 Espanhol (Stack)
    📓 Básico (Notebook)

📁 Projetos Pessoais (Space)
  📚 Casa (Stack)
    📓 Reformas (Notebook)
  📚 Viagens (Stack)
    📓 Europa 2024 (Notebook)
```

### Editor de Texto

O editor suporta:
- **Formatação**: Negrito, itálico, tachado, código inline
- **Títulos**: H1, H2
- **Listas**: Com marcadores e numeradas
- **Tabelas**: Inserir tabelas com cabeçalho
- **Citações**: Blockquotes
- **Código**: Blocos de código com syntax highlighting

### Diagramas Mermaid

Para criar um diagrama Mermaid, use blocos de código:

\`\`\`mermaid
graph TD
    A[Início] --> B[Processo]
    B --> C[Fim]
\`\`\`

O diagrama será renderizado automaticamente com linhas corretas (não apenas `A---------E`).

### Usando a IA

1. **Configurar**: Clique no ícone de engrenagem no chatbox
2. **Selecionar Provider**: Escolha entre OpenAI, Anthropic, Google ou llama.cpp
3. **Adicionar API Key**: Cole sua chave de API (não necessário para llama.cpp)
4. **Habilitar Thinking**: Para Claude, ative o Extended Thinking para ver o raciocínio
5. **Gerar**: Digite um prompt e clique em "Gerar"

#### Comportamento da IA

- **Texto vazio**: A IA gera novo conteúdo
- **Texto existente**: A IA edita/complementa o texto atual baseado no prompt

#### Exemplos de Prompts

- "Resuma este texto em 3 pontos principais"
- "Adicione exemplos práticos sobre este tópico"
- "Transforme isto em uma lista de passos"
- "Corrija erros gramaticais"

### llama.cpp (Modelos Locais)

Para usar modelos locais via llama.cpp:

1. Instale e rode o llama.cpp server:
```bash
./server -m models/your-model.gguf --port 8080
```

2. No chatbox, selecione "llama.cpp (Local)" como provider
3. Não é necessário API key

## API Endpoints

### Spaces
- `GET /api/spaces` - Listar todos
- `POST /api/spaces` - Criar
- `PUT /api/spaces/:id` - Atualizar
- `DELETE /api/spaces/:id` - Deletar

### Stacks
- `GET /api/stacks?space_id=:id` - Listar por space
- `POST /api/stacks` - Criar
- `PUT /api/stacks/:id` - Atualizar
- `DELETE /api/stacks/:id` - Deletar

### Notebooks
- `GET /api/notebooks?stack_id=:id` - Listar por stack
- `POST /api/notebooks` - Criar
- `PUT /api/notebooks/:id` - Atualizar
- `DELETE /api/notebooks/:id` - Deletar

### Notes
- `GET /api/notes?notebook_id=:id` - Listar por notebook
- `POST /api/notes` - Criar
- `PUT /api/notes/:id` - Atualizar
- `DELETE /api/notes/:id` - Deletar

### IA
- `POST /api/ai/generate` - Gerar texto com IA
- `GET /api/ai/llama/health` - Verificar status do llama.cpp

## Tecnologias

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Axios (para chamadas de API de IA)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- TipTap (editor de texto rico)
- Mermaid (diagramas)
- Zustand (state management)
- Axios

## Estrutura de Dados

### Space
```typescript
{
  id: number
  name: string
  color: string
  created_at: string
  updated_at: string
}
```

### Stack
```typescript
{
  id: number
  name: string
  space_id: number
  created_at: string
  updated_at: string
}
```

### Notebook
```typescript
{
  id: number
  name: string
  stack_id: number
  created_at: string
  updated_at: string
}
```

### Note
```typescript
{
  id: number
  title: string
  content: string (HTML)
  notebook_id: number
  created_at: string
  updated_at: string
}
```

## Desenvolvimento

### Backend
```bash
cd backend
npm run dev     # Modo desenvolvimento
npm run build   # Build para produção
npm start       # Iniciar produção
```

### Frontend
```bash
cd frontend
npm run dev     # Modo desenvolvimento
npm run build   # Build para produção
npm run preview # Preview da build
```

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## Suporte

Para problemas ou sugestões, abra uma issue no repositório.
