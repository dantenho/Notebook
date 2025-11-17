# Guia de Instalação - Study Notebook (Windows 11)

## Para Usuários Finais

### Requisitos do Sistema

- **Sistema Operacional:** Windows 11 (ou Windows 10 versão 1903+)
- **Arquitetura:** 64-bit (x64)
- **RAM:** Mínimo 4GB, recomendado 8GB
- **Espaço em Disco:** 500MB para o app + espaço para seus dados
- **Internet:** Opcional (necessária apenas para PubMed/SciELO/IA online)

### Download

1. Acesse a página de Releases no GitHub
2. Baixe o arquivo mais recente:
   ```
   Study-Notebook-Setup-1.0.0.exe
   ```
3. Tamanho aproximado: ~150-200MB

### Instalação

#### Passo 1: Executar o Instalador

1. Localize o arquivo baixado (geralmente em `Downloads`)
2. Clique duplo em `Study-Notebook-Setup-1.0.0.exe`

#### Passo 2: SmartScreen do Windows

Se aparecer o aviso do Windows SmartScreen:

```
O Windows protegeu seu computador
```

1. Clique em **"Mais informações"**
2. Clique em **"Executar assim mesmo"**

> **Por que isso acontece?**
> O app não está assinado digitalmente (requer certificado pago).
> É seguro - você pode verificar o código fonte no GitHub.

#### Passo 3: Instalador NSIS

O instalador abrirá com as seguintes opções:

1. **Bem-vindo**
   - Clique em "Next"

2. **Licença (MIT)**
   - Leia e clique em "I Agree"

3. **Diretório de Instalação**
   - Padrão: `C:\Program Files\Study Notebook`
   - Ou escolha outro local
   - Clique em "Next"

4. **Atalhos**
   - ✅ Criar atalho na Área de Trabalho
   - ✅ Criar atalho no Menu Iniciar
   - Clique em "Next"

5. **Instalação**
   - Clique em "Install"
   - Aguarde (30-60 segundos)

6. **Concluir**
   - ✅ "Run Study Notebook" (executar agora)
   - Clique em "Finish"

### Primeira Execução

1. O app abrirá automaticamente
2. Janela principal aparecerá (1400x900 pixels)
3. Sidebar vazia - **pronto para usar!**

### Começando a Usar

#### Criar Primeira Estrutura

1. Clique em **"Novo Space"**
   - Digite: "Medicina"
   - Escolha cor: Vermelho

2. Clique no **+** ao lado de "Medicina"
   - Crie Stack: "Cardiologia"

3. Clique no **+** ao lado de "Cardiologia"
   - Crie Notebook: "IAM"

4. Clique no **+** ao lado de "IAM"
   - Crie Note: "IAMCEST"

5. Comece a escrever!

#### Adicionar Fontes

1. Abra uma nota
2. Clique em **"Fontes (0)"** no topo
3. Escolha o tipo:
   - **PDF:** Upload de arquivo
   - **Web:** Cole URL
   - **PubMed:** Busque artigos
   - **SciELO:** Busque em português

4. A IA usará automaticamente!

#### Configurar IA

1. No ChatBox (parte inferior)
2. Clique no ícone de **Configurações** (⚙️)
3. Escolha provider:
   - OpenAI
   - Anthropic (Claude)
   - Google (Gemini)
   - llama.cpp (local)
4. Cole sua API key
5. Pronto!

### Localização dos Dados

Seus dados ficam em:

```
C:\Users\<SeuNome>\AppData\Roaming\Study Notebook\
```

Contém:
- `database.sqlite` - Todas as notas e fontes
- `uploads\` - PDFs enviados

### Backup

Para fazer backup:

1. Feche o Study Notebook
2. Abra o Windows Explorer
3. Cole na barra de endereço:
   ```
   %APPDATA%\Study Notebook
   ```
4. Copie toda a pasta
5. Salve em local seguro (nuvem, HD externo)

Para restaurar:
1. Feche o Study Notebook
2. Cole os arquivos de volta
3. Abra o app

### Desinstalação

**Método 1: Configurações do Windows**
1. Abra `Configurações`
2. Vá em `Aplicativos` → `Aplicativos e recursos`
3. Encontre "Study Notebook"
4. Clique em `...` → `Desinstalar`

**Método 2: Painel de Controle**
1. Abra `Painel de Controle`
2. `Programas` → `Programas e Recursos`
3. Selecione "Study Notebook"
4. Clique em "Desinstalar"

**Método 3: Desinstalador Direto**
1. Vá em `C:\Program Files\Study Notebook`
2. Execute `Uninstall Study Notebook.exe`

> **Nota:** Seus dados em `AppData` são preservados por padrão

Para remover completamente incluindo dados:
1. Desinstale normalmente
2. Delete manualmente: `%APPDATA%\Study Notebook`

## Troubleshooting

### App não abre

**Solução 1:** Executar como Administrador
- Clique direito no ícone
- "Executar como administrador"

**Solução 2:** Verificar requisitos
- Windows 11 atualizado?
- 64-bit?
- Antivírus bloqueando?

**Solução 3:** Reinstalar
- Desinstale completamente
- Reinicie o computador
- Instale novamente

### Erro ao fazer upload de PDF

**Causa:** Permissões de arquivo

**Solução:**
- Clique direito no PDF
- Propriedades → Desbloquear
- Ou copie para outra pasta

### App muito lento

**Causas comuns:**
- Muitas fontes por nota (>10)
- PDFs muito grandes (>50MB)
- Pouca RAM disponível

**Soluções:**
- Remova fontes não utilizadas
- Comprima PDFs grandes
- Feche outros programas
- Feche notas não utilizadas

### Banco de dados corrompido

**Sintomas:**
- App fecha sozinho
- Erro ao salvar
- Notas desaparecem

**Solução:**
1. Feche o app
2. Vá em `%APPDATA%\Study Notebook`
3. Renomeie `database.sqlite` para `database.sqlite.backup`
4. Abra o app (criará novo banco)
5. Se necessário, tente recuperar o backup

### SmartScreen bloqueia instalação

**Isso é normal!**

O app não tem assinatura digital (certificado custa $300+/ano).

**Para instalar:**
1. Clique em "Mais informações"
2. Clique em "Executar assim mesmo"

**É seguro:**
- Código aberto no GitHub
- Sem telemetria
- Sem conexões suspeitas
- Dados ficam locais

### Antivírus alerta falso positivo

Alguns antivírus marcam apps Electron como suspeitos.

**Soluções:**
1. Adicione exceção no antivírus
2. Caminho: `C:\Program Files\Study Notebook`
3. Ou use Windows Defender (geralmente não bloqueia)

## Perguntas Frequentes (FAQ)

### Preciso de internet?

**Não!** O app funciona 100% offline.

**Internet necessária apenas para:**
- Buscar no PubMed
- Buscar no SciELO
- Usar IA online (OpenAI, Anthropic, Google)

**Funciona offline:**
- Criar e editar notas
- Upload de PDFs
- Usar llama.cpp (IA local)
- Tudo mais!

### API keys são seguras?

**Sim!** API keys ficam:
- Apenas no seu computador
- No arquivo local do app
- Nunca enviadas a servidores externos
- Criptografadas no disco

### Quantas notas posso ter?

**Ilimitado!** SQLite suporta:
- Milhares de notas
- Centenas de PDFs
- Gigabytes de dados

Limite prático: espaço em disco.

### Posso usar em múltiplos PCs?

**Sim!** Opções:

**Opção 1:** Backup manual
- Copie pasta `%APPDATA%\Study Notebook`
- Cole em outro PC

**Opção 2:** Sincronização com nuvem
- Mova pasta para Dropbox/OneDrive
- Crie symbolic link
- Automático entre PCs

**Opção 3:** Portátil
- Copie pasta para pen drive
- Configure path de dados
- Use em qualquer PC

### Posso exportar minhas notas?

**Atualmente:** Banco SQLite

**Futuras versões:**
- Export para Markdown
- Export para PDF
- Export para HTML

**Workaround atual:**
- Use cliente SQLite
- Acesse database.sqlite
- Exporte manualmente

### Qual a diferença entre versões?

| Versão | Status | Features |
|--------|--------|----------|
| 1.0.0 | Release Inicial | Core + Fontes + IA |
| 1.1.0 | Planejado | Export, Tags, Search |
| 2.0.0 | Futuro | Sync, Mobile, Plugins |

## Suporte

### Reportar Problemas

1. GitHub Issues: [link do repo]
2. Descreva:
   - Versão do Windows
   - Passos para reproduzir
   - Mensagem de erro (print)
   - Logs (se tiver)

### Logs do App

Para debug, logs estão em:
```
%APPDATA%\Study Notebook\logs\
```

### Comunidade

- GitHub Discussions
- Email: [contact email]

## Atualização

Quando sair nova versão:

1. **Backup primeiro!**
2. Desinstale versão antiga
3. Instale nova versão
4. Seus dados são mantidos

Futuro: Auto-update automático

## Recursos Adicionais

- [README.md](README.md) - Visão geral
- [SOURCES_GUIDE.md](SOURCES_GUIDE.md) - Guia de fontes
- [EXAMPLES.md](EXAMPLES.md) - Exemplos de uso
- [README_DESKTOP.md](README_DESKTOP.md) - Documentação técnica

---

**Desenvolvido com 💙 para estudantes de medicina**

**Foco especial: Preparação para Revalida 🎓**

**Privacidade garantida: Seus dados ficam no seu computador 🔒**
