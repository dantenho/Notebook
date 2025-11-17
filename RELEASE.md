# Release Guide - Study Notebook Windows

Guia para criar e publicar releases do Study Notebook para Windows 11.

## Pré-requisitos

### Software Necessário

```bash
# Node.js 18+ e npm
node --version  # v18.0.0+
npm --version   # 9.0.0+

# Git
git --version

# Opcional: Windows SDK (para assinar digitalmente)
```

### Dependências

```bash
# Na raiz do projeto
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

## Processo de Release

### 1. Preparação

#### 1.1 Atualizar Versão

Editar `package.json` (raiz):

```json
{
  "version": "1.0.1"  // Incrementar versão
}
```

#### 1.2 Verificar Ícones

```bash
# Verificar se ícones existem
ls -la build/icon.*

# Devem existir:
# - build/icon.ico (Windows)
# - build/icon.icns (macOS)
# - build/icon.png (Linux)
```

Se não existirem ícones, veja `build/create-icons.md`

#### 1.3 Limpar Builds Anteriores

```bash
npm run clean
```

### 2. Build

#### Opção A: Script Automático (Recomendado)

```bash
./scripts/build-windows.sh
```

Este script:
- ✅ Verifica dependências
- ✅ Builda backend
- ✅ Builda frontend
- ✅ Cria instalador Windows
- ✅ Mostra localização do arquivo

#### Opção B: Manual

```bash
# 1. Build backend
cd backend
npm run build
cd ..

# 2. Build frontend
cd frontend
npm run build
cd ..

# 3. Criar instalador
npm run release:win
```

### 3. Verificação

#### 3.1 Localizar Instalador

```bash
ls -lh dist-electron/

# Deve conter:
# Study-Notebook-Setup-1.0.0.exe
```

#### 3.2 Verificar Tamanho

Tamanho esperado: ~150-200MB

```bash
du -h dist-electron/*.exe
```

#### 3.3 Testar Instalador (Windows)

**Em máquina Windows 11:**

1. Copie o `.exe` para máquina Windows
2. Execute o instalador
3. Instale em local de teste
4. Abra o app
5. Teste funcionalidades:
   - ✅ Criar nota
   - ✅ Upload PDF
   - ✅ Buscar PubMed
   - ✅ Usar IA
   - ✅ Salvar/fechar/reabrir

6. Desinstale
7. Verifique se dados foram preservados

### 4. Criar Release GitHub

#### 4.1 Criar Tag

```bash
# Criar tag local
git tag -a v1.0.0 -m "Release 1.0.0 - Initial Windows Release"

# Push tag
git push origin v1.0.0
```

#### 4.2 Criar Release no GitHub

1. Vá em GitHub → Releases → "Create a new release"

2. **Tag:** v1.0.0

3. **Title:** Study Notebook v1.0.0 - Windows Release

4. **Description:**

```markdown
# Study Notebook v1.0.0

Primeiro release oficial do Study Notebook para Windows 11!

## 🎯 O que é?

Aplicativo desktop de anotações com IA focado em medicina e preparação para Revalida.

## ✨ Funcionalidades

- 📚 Hierarquia de 4 níveis (Spaces → Stacks → Notebooks → Notes)
- 📄 Sistema de Fontes (PDF, Web, PubMed, SciELO)
- 🤖 Integração com IA (OpenAI, Anthropic, Google, llama.cpp)
- ✏️ Editor rico com Mermaid
- 🔒 100% local e privado
- ⚡ Funciona offline

## 📦 Download

**Windows 11 (64-bit):**
- Baixe: `Study-Notebook-Setup-1.0.0.exe`
- Tamanho: ~XXX MB
- [Guia de Instalação](WINDOWS_INSTALL.md)

## 🚀 Instalação Rápida

1. Baixe o `.exe`
2. Execute (clique em "Mais informações" se aparecer SmartScreen)
3. Siga o instalador
4. Pronto para usar!

## 📖 Documentação

- [Guia de Instalação Completo](WINDOWS_INSTALL.md)
- [Guia de Fontes](SOURCES_GUIDE.md)
- [Exemplos de Uso](EXAMPLES.md)

## 🆕 Novidades nesta versão

- ✅ Release inicial
- ✅ Suporte completo a Windows 11
- ✅ Sistema de fontes integrado
- ✅ 4 providers de IA
- ✅ Instalador NSIS otimizado

## 🐛 Problemas Conhecidos

- [ ] Ícone é placeholder (versão final terá ícone profissional)
- [ ] SmartScreen alerta (normal - app não assinado digitalmente)

## ⚠️ Requisitos

- Windows 11 ou Windows 10 (versão 1903+)
- 4GB RAM (8GB recomendado)
- 500MB espaço livre
- Internet opcional (apenas para buscas externas e IA online)

## 🔐 Privacidade

- ✅ Dados 100% locais
- ✅ API keys armazenadas localmente
- ✅ Sem telemetria
- ✅ Sem conexões externas não solicitadas

## 📊 Checksums

```
SHA256:
[hash do arquivo]
```

## 🙏 Feedback

Problemas ou sugestões:
- [Abrir Issue](link)
- [Discussions](link)

---

**Desenvolvido com 💙 para estudantes de medicina**

**Foco especial: Preparação para Revalida 🎓**
```

5. **Upload Assets:**
   - `Study-Notebook-Setup-1.0.0.exe`
   - (Opcional) `LICENSE`
   - (Opcional) `WINDOWS_INSTALL.md`

6. **Publicar Release**

### 5. Checksums

Gerar checksums para verificação:

```bash
# SHA256
sha256sum dist-electron/Study-Notebook-Setup-1.0.0.exe > dist-electron/checksums.txt

# MD5
md5sum dist-electron/Study-Notebook-Setup-1.0.0.exe >> dist-electron/checksums.txt

# Exibir
cat dist-electron/checksums.txt
```

Adicionar checksums na descrição do release.

### 6. Distribuição

#### Canais de Distribuição

1. **GitHub Releases** (principal)
   - Usuários baixam diretamente
   - Versionamento claro
   - Changelog visível

2. **Website** (opcional)
   - Link direto para release
   - Instruções de instalação
   - Screenshots

3. **Social Media** (opcional)
   - Anúncio em grupos médicos
   - Twitter/LinkedIn
   - WhatsApp/Telegram

## Troubleshooting do Build

### Erro: Backend dist não encontrado

```bash
cd backend
npm run build
ls -la dist/  # Verificar se index.js existe
```

### Erro: Frontend dist não encontrado

```bash
cd frontend
npm run build
ls -la dist/  # Verificar se index.html existe
```

### Erro: electron-builder falha

```bash
# Limpar tudo e reinstalar
npm run clean
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
npm run build
npm run release:win
```

### Instalador muito grande (>300MB)

**Causas:**
- Dependências dev incluídas
- node_modules não otimizado

**Soluções:**
```bash
# Backend: usar apenas production deps
cd backend
npm prune --production

# Rebuild
npm run build
npm run release:win
```

### SmartScreen bloqueia durante teste

**Normal!** App não está assinado.

**Para assinar digitalmente:**
1. Compre certificado de code signing (~$300/ano)
2. Configure electron-builder:
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
```

## CI/CD (Futuro)

### GitHub Actions

Criar `.github/workflows/build-windows.yml`:

```yaml
name: Build Windows Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm run install:all

      - name: Build
        run: npm run build

      - name: Package
        run: npm run release:win

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: dist-electron/*.exe

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist-electron/*.exe
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Checklist de Release

Antes de publicar release:

- [ ] Versão atualizada em `package.json`
- [ ] Changelog criado/atualizado
- [ ] Ícones presentes (ou ao menos placeholder)
- [ ] Build completo sem erros
- [ ] Instalador testado em Windows 11
- [ ] Funcionalidades principais testadas
- [ ] Documentação atualizada
- [ ] Tag Git criada
- [ ] Release notes escritas
- [ ] Checksums gerados
- [ ] Assets uploaded no GitHub
- [ ] Release publicado

## Próximas Versões

### v1.1.0 (Planejado)

- [ ] Export de notas (Markdown, PDF)
- [ ] Busca global
- [ ] Tags para notas
- [ ] Atalhos de teclado
- [ ] Modo escuro

### v1.2.0 (Planejado)

- [ ] Ícone profissional
- [ ] Assinatura digital (code signing)
- [ ] Auto-update
- [ ] Estatísticas de uso
- [ ] Templates de notas

### v2.0.0 (Futuro)

- [ ] Sincronização em nuvem
- [ ] Versão mobile
- [ ] Sistema de plugins
- [ ] Colaboração

## Recursos

- [electron-builder docs](https://www.electron.build/)
- [NSIS docs](https://nsis.sourceforge.io/Docs/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Release Strategy](https://www.electron.build/configuration/publish)

---

**Última atualização:** 2024

**Maintainer:** [Nome]

**Licença:** MIT
