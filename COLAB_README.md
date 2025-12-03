# 📚 Study Notebook - Teste no Google Colab

## 🎯 O que é isso?

Este notebook permite **testar o Study Notebook completo diretamente no Google Colab**, sem precisar instalar nada no seu computador!

## 🚀 Como Usar

### Opção 1: Link Direto (Mais Fácil)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/seu-usuario/Notebook/blob/main/StudyNotebook_Colab_Test.ipynb)

**Passos:**
1. Clique no botão "Open in Colab" acima
2. Execute: `Runtime → Run all`
3. Aguarde ~3-5 minutos
4. Pronto! A API estará rodando

### Opção 2: Upload Manual

1. Acesse [Google Colab](https://colab.research.google.com)
2. `File → Upload notebook`
3. Selecione `StudyNotebook_Colab_Test.ipynb`
4. Execute `Runtime → Run all`

---

## 📦 O que será instalado?

✅ **Node.js 18** - Runtime JavaScript
✅ **npm** - Gerenciador de pacotes
✅ **SQLite** - Banco de dados
✅ **Backend completo** - Express + TypeScript
✅ **ngrok** - Túnel para acesso público

**Tempo estimado:** 3-5 minutos

---

## 🧪 O que será testado?

### 1️⃣ Infraestrutura
- ✅ Instalação do Node.js
- ✅ Clone do repositório
- ✅ Instalação de dependências
- ✅ Compilação TypeScript
- ✅ Inicialização do servidor

### 2️⃣ Banco de Dados
- ✅ Criação das 14 tabelas
- ✅ Inserção de configurações padrão
- ✅ Validação de integridade

### 3️⃣ APIs REST

**Customização:**
- `GET /api/user-settings` - Buscar configurações
- `PUT /api/user-settings` - Atualizar configurações
- `POST /api/user-settings/reset` - Resetar

**Ícones:**
- `GET /api/icons` - 200+ ícones em 10 categorias
- `GET /api/icons/avatars` - 100+ avatares em 4 categorias
- `GET /api/icons/search?category=medical` - Busca

**CRUD:**
- `GET/POST/PUT/DELETE /api/spaces` - Espaços
- `GET/POST/PUT/DELETE /api/stacks` - Pilhas
- `GET/POST/PUT/DELETE /api/notebooks` - Cadernos
- `GET/POST/PUT/DELETE /api/notes` - Notas

### 4️⃣ Funcionalidades
- ✅ Health check
- ✅ CRUD completo
- ✅ Sistema de customização
- ✅ Biblioteca de ícones
- ✅ Configurações de usuário

---

## 📊 Resultados Esperados

Após executar todas as células, você verá:

```
✅ Servidor está online!
✅ Total de ícones: 234
✅ Total de avatares: 102
✅ Configurações atualizadas
✅ Space criado
✅ Banco de dados criado
```

E receberá uma **URL pública do ngrok** para acessar a API:

```
🌐 URL da API: https://xxxx-xx-xxx-xxx-xx.ngrok.io
```

---

## 🔗 Acessando a API

### Pelo navegador:

```
https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/health
https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/icons
https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/icons/avatars
```

### Pelo Postman/Insomnia:

1. Copie a URL do ngrok
2. Importe a collection (ver abaixo)
3. Teste os endpoints

### Por código Python (no próprio Colab):

```python
import requests

API_URL = "http://localhost:3001/api"

# Buscar ícones
response = requests.get(f"{API_URL}/icons")
print(response.json())

# Buscar avatares
response = requests.get(f"{API_URL}/icons/avatars")
print(response.json())

# Criar Space
space_data = {
    "name": "Medicina",
    "icon": "⚕️",
    "color": "#3b82f6"
}
response = requests.post(f"{API_URL}/spaces", json=space_data)
print(response.json())
```

---

## 📋 Collection do Postman

Importe esta collection para testar facilmente:

```json
{
  "info": {
    "name": "Study Notebook - Colab",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Get Icons",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/icons"
      }
    },
    {
      "name": "Get Avatars",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/icons/avatars"
      }
    },
    {
      "name": "Get User Settings",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/user-settings"
      }
    },
    {
      "name": "Update User Settings",
      "request": {
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"avatar\": \"🤓\",\n  \"display_name\": \"Dr. João\",\n  \"theme\": \"dark\"\n}"
        },
        "url": "{{base_url}}/user-settings"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001/api"
    }
  ]
}
```

**Como usar:**
1. Copie o JSON acima
2. No Postman: `Import → Raw text → Paste`
3. Altere `{{base_url}}` para a URL do ngrok

---

## ⚠️ Limitações do Colab

### O que funciona:
✅ Backend completo
✅ Banco de dados SQLite
✅ Todas as APIs REST
✅ Testes automatizados
✅ Acesso via ngrok

### O que NÃO funciona:
❌ Frontend React (precisa de servidor separado)
❌ Electron desktop app
❌ Upload de arquivos grandes
❌ Persistência após fechar o notebook

### Observações:
- ⚠️ O Colab pode desconectar após ~12h de inatividade
- ⚠️ Dados são perdidos ao fechar o notebook
- ⚠️ URL do ngrok muda a cada execução
- ✅ Ideal para testes e desenvolvimento

---

## 🐛 Troubleshooting

### Problema: "Erro ao clonar repositório"
**Solução:** Certifique-se de que a URL do repositório está correta na célula 2

### Problema: "Servidor não inicia"
**Solução:**
1. Verifique se a porta 3001 está livre
2. Veja os logs: `!cat Notebook/backend/server.log`

### Problema: "ngrok não conecta"
**Solução:**
1. Execute novamente a célula do ngrok
2. Ou use a URL local: `http://localhost:3001`

### Problema: "Testes falhando"
**Solução:**
1. Aguarde 10s após iniciar o servidor
2. Execute `!ps aux | grep node` para ver se está rodando
3. Reinicie o runtime: `Runtime → Restart runtime`

---

## 📊 Exemplo de Saída

```
═══════════════════════════════════════════════════════════════
📊 RELATÓRIO DE VALIDAÇÃO - STUDY NOTEBOOK
═══════════════════════════════════════════════════════════════

🔧 TESTES DE INFRAESTRUTURA:

  ✅ Node.js instalado
  ✅ Repositório clonado
  ✅ Dependências instaladas
  ✅ TypeScript compilado
  ✅ Servidor iniciado

🌐 TESTES DE API:

  ✅ Health Check (Status: 200)
  ✅ Biblioteca de Ícones (Status: 200)
  ✅ Biblioteca de Avatares (Status: 200)
  ✅ Configurações de Usuário (Status: 200)
  ✅ Spaces (CRUD) (Status: 200)

═══════════════════════════════════════════════════════════════
✅ VALIDAÇÃO CONCLUÍDA!
═══════════════════════════════════════════════════════════════

📝 Próximos passos:
  1. Acesse a URL do ngrok para testar via Postman/Insomnia
  2. Integre com o frontend React
  3. Deploy em produção (Docker/Cloud)
```

---

## 🎯 Próximos Passos

Após testar no Colab, você pode:

1. **Rodar localmente:**
   ```bash
   git clone https://github.com/seu-usuario/Notebook.git
   cd Notebook/backend
   npm install
   npm run build
   npm start
   ```

2. **Rodar com Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Deploy em produção:**
   - Heroku
   - Railway
   - Render
   - Fly.io
   - DigitalOcean

---

## 📚 Documentação Adicional

- [Guia de Distribuição](GUIA_DISTRIBUICAO.md)
- [Relatório de Validação](RELATORIO_VALIDACAO.md)
- [Código e Avaliação](CODIGO_AVALIACAO.md)
- [Sistema de Trilhas](OTIMIZACOES_UI_TRILHAS.md)

---

## 💬 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/Notebook/issues)
- **Discussões:** [GitHub Discussions](https://github.com/seu-usuario/Notebook/discussions)

---

**Desenvolvido com ❤️ pela equipe Study Notebook**

**Versão:** 1.1.0
**Data:** 2025-11-18
