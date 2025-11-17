# ═══════════════════════════════════════════════════════════════
# Makefile - Study Notebook
# ═══════════════════════════════════════════════════════════════
#
# Comandos úteis para desenvolvimento e deploy
#

.PHONY: help install build dev docker-build docker-up docker-down clean test

# Cores
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m

help:  ## Mostra esta ajuda
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)    STUDY NOTEBOOK - Comandos Disponíveis$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

install:  ## Instala todas as dependências
	@echo "$(YELLOW)Instalando dependências...$(NC)"
	@cd backend && npm install
	@cd frontend && npm install
	@echo "$(GREEN)✓ Dependências instaladas$(NC)"

build:  ## Compila backend e frontend
	@echo "$(YELLOW)Compilando backend...$(NC)"
	@cd backend && npm run build
	@echo "$(GREEN)✓ Backend compilado$(NC)"
	@echo "$(YELLOW)Compilando frontend...$(NC)"
	@cd frontend && npm run build
	@echo "$(GREEN)✓ Frontend compilado$(NC)"

dev-backend:  ## Inicia backend em modo desenvolvimento
	@echo "$(YELLOW)Iniciando backend...$(NC)"
	@cd backend && npm run dev

dev-frontend:  ## Inicia frontend em modo desenvolvimento
	@echo "$(YELLOW)Iniciando frontend...$(NC)"
	@cd frontend && npm run dev

dev:  ## Inicia backend e frontend em paralelo (requer tmux ou similar)
	@echo "$(YELLOW)Iniciando ambiente de desenvolvimento...$(NC)"
	@make -j2 dev-backend dev-frontend

docker-build:  ## Build da imagem Docker
	@echo "$(YELLOW)Building Docker image...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✓ Docker image built$(NC)"

docker-up:  ## Inicia aplicação com Docker
	@echo "$(YELLOW)Iniciando containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Containers iniciados$(NC)"
	@echo "$(BLUE)Acesse: http://localhost:3001$(NC)"

docker-down:  ## Para containers Docker
	@echo "$(YELLOW)Parando containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Containers parados$(NC)"

docker-logs:  ## Mostra logs dos containers
	@docker-compose logs -f

docker-restart:  ## Reinicia containers
	@make docker-down
	@make docker-up

docker-clean:  ## Remove containers, volumes e imagens
	@echo "$(YELLOW)Limpando Docker...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)✓ Docker limpo$(NC)"

test-db:  ## Testa banco de dados
	@echo "$(YELLOW)Testando banco de dados...$(NC)"
	@cd backend && node src/scripts/validate-database.js

test-api:  ## Testa API REST
	@echo "$(YELLOW)Testando API...$(NC)"
	@cd backend && node src/scripts/test-api.js

test-flow:  ## Simula fluxo de usuário
	@echo "$(YELLOW)Simulando fluxo de usuário...$(NC)"
	@cd backend && node src/scripts/simulate-user-flow.js

test:  ## Executa todos os testes
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)    Executando Testes$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@make test-db
	@make test-api
	@make test-flow
	@echo "$(GREEN)✓ Todos os testes concluídos$(NC)"

clean:  ## Limpa arquivos temporários e builds
	@echo "$(YELLOW)Limpando arquivos temporários...$(NC)"
	@rm -rf backend/dist
	@rm -rf backend/node_modules
	@rm -rf frontend/dist
	@rm -rf frontend/node_modules
	@rm -rf dist
	@rm -f backend/*.sqlite
	@rm -f backend/*.sqlite-*
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

package-windows:  ## Cria pacote para Windows
	@echo "$(YELLOW)Criando pacote Windows...$(NC)"
	@powershell -ExecutionPolicy Bypass -File build-windows.ps1

package-linux:  ## Cria pacote para Linux
	@echo "$(YELLOW)Criando pacote Linux...$(NC)"
	@./build-package.sh

backup:  ## Faz backup do banco de dados
	@echo "$(YELLOW)Criando backup...$(NC)"
	@mkdir -p backups
	@cp backend/database/database.sqlite backups/database-$(shell date +%Y%m%d-%H%M%S).sqlite
	@echo "$(GREEN)✓ Backup criado em backups/$(NC)"

restore:  ## Restaura último backup (use: make restore FILE=backup.sqlite)
	@echo "$(YELLOW)Restaurando backup...$(NC)"
	@cp $(FILE) backend/database/database.sqlite
	@echo "$(GREEN)✓ Backup restaurado$(NC)"

lint:  ## Verifica código com linter
	@echo "$(YELLOW)Verificando código...$(NC)"
	@cd backend && npm run lint || true
	@cd frontend && npm run lint || true

format:  ## Formata código
	@echo "$(YELLOW)Formatando código...$(NC)"
	@cd backend && npm run format || true
	@cd frontend && npm run format || true

status:  ## Mostra status da aplicação
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)    Status da Aplicação$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend:$(NC)"
	@[ -f backend/dist/index.js ] && echo "  $(GREEN)✓ Compilado$(NC)" || echo "  $(YELLOW)✗ Não compilado$(NC)"
	@[ -d backend/node_modules ] && echo "  $(GREEN)✓ Dependências instaladas$(NC)" || echo "  $(YELLOW)✗ Dependências não instaladas$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@[ -d frontend/dist ] && echo "  $(GREEN)✓ Compilado$(NC)" || echo "  $(YELLOW)✗ Não compilado$(NC)"
	@[ -d frontend/node_modules ] && echo "  $(GREEN)✓ Dependências instaladas$(NC)" || echo "  $(YELLOW)✗ Dependências não instaladas$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@docker-compose ps 2>/dev/null || echo "  $(YELLOW)Containers não iniciados$(NC)"
	@echo ""

all: install build  ## Instala dependências e compila tudo

.DEFAULT_GOAL := help
