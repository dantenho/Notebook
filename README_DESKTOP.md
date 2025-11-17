# Study Notebook - Aplicativo Desktop 🖥️

**Aplicativo Desktop** de anotações completo com IA, similar ao Evernote + NotebookLM.

**Hierarquia de 4 níveis**: Spaces → Stacks → Notebooks → Notes
**Sistema de Fontes**: PDFs, Web, PubMed, SciELO
**IA Integrada**: OpenAI, Anthropic, Google, llama.cpp

## 🎯 Por que Desktop?

- 🖥️ **Aplicativo Nativo**: Windows, macOS, Linux
- 💾 **Armazenamento Local**: SQLite no seu computador
- 🔒 **Privacidade Total**: Dados e API keys nunca saem da sua máquina
- ⚡ **Offline First**: Funciona sem internet (exceto buscas externas)
- 🚀 **Performance**: Mais rápido que aplicações web
- 📦 **Tudo Incluído**: Um único executável, sem dependências

## 🚀 Quickstart

### Para Usuários (Instalar)

**Opção 1: Download (Recomendado)**
1. Baixe o instalador para seu sistema em Releases
2. Execute o instalador
3. Abra o Study Notebook
4. Comece a usar!

**Opção 2: Build Manual**
```bash
git clone <repo>
cd Notebook
npm run install:all
npm run build
npm run package  # Cria instalador
```

### Para Desenvolvedores

```bash
# 1. Clonar repositório
git clone <repo>
cd Notebook

# 2. Método Rápido
./dev.sh

# 3. Método Manual
npm run install:all
npm run dev
```

O app desktop abrirá automaticamente em modo desenvolvimento.

## 📦 Estrutura do Projeto

```
Study-Notebook/
├── electron/          # Electron main process
│   ├── main.js       # Janela principal e backend interno
│   └── preload.js    # Bridge seguro
├── backend/          # Express API (roda internamente)
│   ├── src/
│   │   ├── db/       # SQLite database
│   │   ├── models/   # Data models
│   │   ├── routes/   # API routes
│   │   └── services/ # AI & Sources services
│   └── package.json
├── frontend/         # React UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── build/            # Ícones do app
├── scripts/          # Helper scripts
└── package.json      # Root (Electron)
```

## 🛠️ Comandos

### Desenvolvimento
```bash
npm run install:all     # Instalar todas as dependências
npm run dev             # Modo desenvolvimento
npm run dev:backend     # Apenas backend
npm run dev:frontend    # Apenas frontend
npm run electron:dev    # Apenas Electron
```

### Build e Distribuição
```bash
npm run build           # Build completo (backend + frontend)
npm run package         # Criar instalador para seu SO
npm run package:win     # Windows (.exe, instalador NSIS)
npm run package:mac     # macOS (.dmg)
npm run package:linux   # Linux (.AppImage, .deb)
```

## 🗄️ Armazenamento de Dados

### Localização dos Dados

O aplicativo armazena todos os dados localmente:

**Windows:**
```
C:\Users\<username>\AppData\Roaming\Study Notebook\
├── database.sqlite    # Banco de dados
└── uploads/          # PDFs enviados
```

**macOS:**
```
~/Library/Application Support/Study Notebook/
├── database.sqlite
└── uploads/
```

**Linux:**
```
~/.config/Study Notebook/
├── database.sqlite
└── uploads/
```

### Backup Manual

Para fazer backup completo:
1. Feche o aplicativo
2. Copie a pasta inteira mencionada acima
3. Guarde em local seguro

Para restaurar:
1. Feche o aplicativo
2. Substitua a pasta pelos arquivos de backup
3. Abra o aplicativo

## 🔑 API Keys

As API keys são armazenadas localmente no aplicativo e **nunca** são enviadas para nenhum servidor.

Configuração:
1. Abra uma nota
2. Use o ChatBox
3. Clique no ícone de configurações (⚙️)
4. Selecione o provider
5. Cole sua API key
6. A key é salva localmente

**Segurança**: As keys ficam apenas no seu computador, no arquivo de dados do usuário.

## 📚 Características Principais

### Hierarquia de 4 Níveis

```
📁 Medicina (Space)
  📚 Cardiologia (Stack)
    📓 IAM (Notebook)
      📄 IAMCEST (Note)
```

### Sistema de Fontes (Similar NotebookLM)

Adicione materiais de referência que a IA usará automaticamente:

1. **PDF** 📄
   - Upload de artigos, livros, apostilas
   - Extração automática de texto
   - Limite: 50MB

2. **Web** 🌐
   - Cole URL de artigos/páginas
   - Extração inteligente de conteúdo
   - Remove ads e navegação

3. **PubMed** 🎓
   - Busca integrada
   - Importação de artigos científicos
   - Metadados completos (PMID, DOI, etc.)

4. **SciELO** 📚
   - Busca em português/espanhol
   - Artigos da América Latina
   - Texto completo quando disponível

### Integração com IA

Suporta múltiplos providers:
- **OpenAI**: GPT-4, GPT-3.5
- **Anthropic**: Claude 3.5 (com Extended Thinking)
- **Google**: Gemini Pro
- **llama.cpp**: Modelos locais (100% offline)

A IA usa automaticamente todas as fontes adicionadas como contexto!

### Editor Rico

- Formatação completa (negrito, itálico, etc.)
- Títulos e listas
- Tabelas
- Blocos de código com syntax highlighting
- Diagramas Mermaid
- Imagens

## 🎓 Caso de Uso: Medicina/Revalida

Perfeito para estudar para o Revalida:

```
1. Criar nota: "IAMCEST - Protocolo"

2. Adicionar fontes:
   📄 PDF: Diretriz SBC de IAM
   🎓 PubMed: "STEMI management 2024"
   📚 SciELO: "Infarto agudo miocardio brasil"
   🌐 Web: Protocolo HC-FMUSP

3. Prompt para IA:
   "Com base nas fontes, crie protocolo de atendimento
   ao IAMCEST focado em condutas que caem no Revalida"

4. Resultado:
   Protocolo completo baseado em:
   - Diretrizes brasileiras (SBC)
   - Evidências recentes (PubMed)
   - Contexto brasileiro (SciELO)
   - Protocolo prático (HC)
```

## 🔧 Desenvolvimento

### Estrutura Técnica

- **Electron**: Processo principal e janela
- **Express**: API REST interna
- **React**: Interface do usuário
- **SQLite**: Banco de dados local
- **TypeScript**: Backend e frontend

### Arquitetura

```
┌─────────────────────────────────────┐
│   Electron Main Process             │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Express    │  │   React     │ │
│  │   Backend    │  │   Frontend  │ │
│  │  (Port 3001) │◄─┤ (Rendered)  │ │
│  └──────────────┘  └─────────────┘ │
│         │                           │
│         ▼                           │
│  ┌──────────────┐                  │
│  │   SQLite     │                  │
│  │  (User Data) │                  │
│  └──────────────┘                  │
└─────────────────────────────────────┘
```

### Hot Reload

Em modo desenvolvimento:
- Frontend: Vite HMR ativo
- Backend: tsx watch ativo
- Electron: Recarrega automaticamente

### Debug

```bash
# Backend logs
# Visíveis no terminal onde rodou npm run dev

# Frontend logs
# Abra DevTools no Electron (Ctrl+Shift+I / Cmd+Opt+I)

# Electron logs
# Console do processo principal
```

## 📖 Documentação Adicional

- [SOURCES_GUIDE.md](SOURCES_GUIDE.md) - Guia completo do sistema de fontes
- [EXAMPLES.md](EXAMPLES.md) - Exemplos de uso para diferentes áreas
- [agent.md](agent.md) - Funções auxiliares para desenvolvimento

## 🚨 Troubleshooting

### App não abre

```bash
# Verificar se o backend buildou
ls backend/dist/index.js

# Se não existir:
cd backend && npm run build
```

### Erro de permissão ao fazer upload de PDF

O app pede permissão para acessar arquivos. Conceda na primeira vez.

### Banco de dados corrompido

```bash
# Localizar banco
# Windows: %APPDATA%/Study Notebook/database.sqlite
# Mac: ~/Library/Application Support/Study Notebook/database.sqlite
# Linux: ~/.config/Study Notebook/database.sqlite

# Fazer backup e deletar
# O app criará um novo na próxima abertura
```

### App muito lento

- Verifique quantidade de fontes por nota (recomendado: max 10)
- PDFs muito grandes são lentos (limite: 50MB)
- Feche notas não utilizadas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📜 Licença

MIT License - veja [LICENSE](LICENSE)

## 🙏 Agradecimentos

- Electron pela plataforma desktop
- React e Vite pelo frontend moderno
- TipTap pelo editor rico
- PubMed e SciELO pelas APIs abertas
- Todos os providers de IA

---

**Desenvolvido com 💙 para estudantes de medicina e profissionais de saúde**

**Foco especial**: Preparação para Revalida 🎓
