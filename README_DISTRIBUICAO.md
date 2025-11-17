# Study Notebook v1.1.0

> 📚 Sistema completo de gerenciamento de estudos com inteligência artificial

![Status](https://img.shields.io/badge/status-stable-green)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 🚀 Instalação Rápida

### 🐳 Docker (Recomendado)

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/study-notebook.git
cd study-notebook

# Iniciar com Docker
docker-compose up -d

# Acessar
http://localhost:3001
```

### 🪟 Windows

```powershell
# 1. Descompactar o ZIP
# 2. Entrar na pasta
cd StudyNotebook-Windows-v1.1.0

# 3. Executar
.\start.bat

# 4. Acessar
http://localhost:3001
```

### 🐧 Linux / macOS

```bash
# Instalação automática
curl -fsSL https://raw.githubusercontent.com/user/repo/main/quick-install.sh | bash

# Ou manual
tar -xzf StudyNotebook-Linux-v1.1.0.tar.gz
cd StudyNotebook-Linux-v1.1.0
./start.sh
```

---

## 📋 Requisitos

| Item | Versão Mínima | Recomendado |
|------|---------------|-------------|
| **Node.js** | 18.0 | 20.0+ |
| **npm** | 9.0 | 10.0+ |
| **RAM** | 2GB | 4GB+ |
| **Disco** | 500MB | 2GB+ |
| **SO** | Windows 10, Ubuntu 20.04, macOS 11 | Atual |

---

## 🎯 Funcionalidades

### ✅ Implementado

- ✅ Hierarquia de organização (Spaces > Stacks > Notebooks > Notes)
- ✅ Editor rico com markdown e HTML
- ✅ Sistema de fontes (PDF, Web, PubMed, SciELO)
- ✅ Integração com IA (OpenAI, Anthropic, Google, Llama.cpp)
- ✅ Sistema de trilhas de aprendizado
- ✅ Revisão espaçada (spaced repetition)
- ✅ Tags e categorização
- ✅ Progresso e analytics
- ✅ Banco SQLite local
- ✅ Interface responsiva

### 🔜 Em Desenvolvimento

- 🔜 Dashboard de progresso visual
- 🔜 Exportação de trilhas
- 🔜 Gamificação
- 🔜 Modo offline completo
- 🔜 Aplicativo móvel

---

## 📚 Documentação

- **[Guia de Distribuição](GUIA_DISTRIBUICAO.md)** - Instalação detalhada
- **[Relatório de Validação](RELATORIO_VALIDACAO.md)** - Testes e validações
- **[Código e Avaliação](CODIGO_AVALIACAO.md)** - Qualidade do código
- **[Sistema de Trilhas](OTIMIZACOES_UI_TRILHAS.md)** - Trilhas de aprendizado

---

## 🔧 Comandos Úteis

### Com Docker

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Backup
docker cp study-notebook-app:/app/backend/database/database.sqlite ./backup.sqlite
```

### Com Makefile

```bash
# Ver todos os comandos
make help

# Instalar dependências
make install

# Compilar tudo
make build

# Iniciar com Docker
make docker-up

# Executar testes
make test

# Criar pacote Windows
make package-windows

# Criar pacote Linux
make package-linux
```

### Manual

```bash
# Backend
cd backend
npm install
npm run build
node dist/index.js

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## 🌐 Endpoints da API

| Endpoint | Descrição |
|----------|-----------|
| `GET /api/health` | Health check |
| `GET /api/spaces` | Listar espaços |
| `POST /api/spaces` | Criar espaço |
| `GET /api/notes` | Listar notas |
| `POST /api/notes` | Criar nota |
| `POST /api/ai/generate` | Gerar texto com IA |
| `GET /api/sources/note/:id` | Listar fontes |

[Documentação completa da API](docs/API.md)

---

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Linux/macOS
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Ou mude a porta no .env
PORT=3002
```

### Erro de compilação

```bash
# Limpar e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Banco corrompido

```bash
# Restaurar backup
cp backup.sqlite database/database.sqlite

# Ou recriar (perde dados!)
rm database/database.sqlite
# Reinicie a aplicação
```

---

## 🔒 Segurança

### Produção

```bash
# 1. Use HTTPS (Nginx + Certbot)
# 2. Configure firewall
sudo ufw allow 3001/tcp

# 3. Proteja arquivos sensíveis
chmod 600 backend/.env
chmod 600 backend/database/database.sqlite

# 4. Backup automático (cron)
0 2 * * * /path/to/backup.sh
```

### API Keys

Nunca commite API keys! Use variáveis de ambiente:

```bash
# backend/.env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

---

## 📊 Performance

### Benchmarks

- **Inicialização:** < 2s
- **Resposta API:** < 50ms (média)
- **Build frontend:** ~27s
- **Build backend:** ~3s
- **Bundle size:** ~1MB (gzipped)

### Otimizações

- ✅ Code splitting
- ✅ Lazy loading
- ✅ SQLite com índices
- ✅ Cache de queries
- ✅ Compressão gzip

---

## 🤝 Contribuindo

```bash
# 1. Fork o projeto
# 2. Crie uma branch
git checkout -b feature/nova-funcionalidade

# 3. Commit suas mudanças
git commit -m "feat: adiciona nova funcionalidade"

# 4. Push para o branch
git push origin feature/nova-funcionalidade

# 5. Abra um Pull Request
```

---

## 📜 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 💬 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/study-notebook/issues)
- **Discussões:** [GitHub Discussions](https://github.com/seu-usuario/study-notebook/discussions)
- **Email:** suporte@studynotebook.com
- **Discord:** [discord.gg/studynotebook](https://discord.gg/studynotebook)

---

## 🎓 Créditos

Desenvolvido com ❤️ pela equipe Study Notebook

### Tecnologias

- **Backend:** Node.js, Express, TypeScript, SQLite
- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **IA:** OpenAI, Anthropic, Google, Llama.cpp
- **Deploy:** Docker, Docker Compose, Nginx

---

**Versão:** 1.1.0
**Data:** 2025-11-17
**Status:** ✅ Stable
