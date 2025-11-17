# ═══════════════════════════════════════════════════════════════
# Script de Build para Windows - Study Notebook
# ═══════════════════════════════════════════════════════════════
#
# Uso:
#   .\build-windows.ps1
#
# Requisitos:
#   - Node.js 18+
#   - npm 9+
#   - 2GB de espaço livre
#

param(
    [switch]$Clean = $false,
    [switch]$Portable = $true
)

# Cores
$ErrorActionPreference = "Stop"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "    STUDY NOTEBOOK - BUILD PARA WINDOWS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ═════════════════════════════════════════════════════════════
# Verificar requisitos
# ═════════════════════════════════════════════════════════════
Write-Host "Verificando requisitos..." -ForegroundColor Yellow

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado. Instale Node.js 18+ de https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ═════════════════════════════════════════════════════════════
# Limpeza (opcional)
# ═════════════════════════════════════════════════════════════
if ($Clean) {
    Write-Host "Limpando builds anteriores..." -ForegroundColor Yellow

    Remove-Item -Path "backend/dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "backend/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "frontend/dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "frontend/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "✓ Limpeza concluída" -ForegroundColor Green
    Write-Host ""
}

# ═════════════════════════════════════════════════════════════
# Build do Backend
# ═════════════════════════════════════════════════════════════
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "PASSO 1/3: Compilando Backend (TypeScript)" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan

Set-Location backend

Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
npm install

Write-Host "Compilando TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao compilar backend" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Backend compilado com sucesso" -ForegroundColor Green
Set-Location ..
Write-Host ""

# ═════════════════════════════════════════════════════════════
# Build do Frontend
# ═════════════════════════════════════════════════════════════
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "PASSO 2/3: Compilando Frontend (React + Vite)" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan

Set-Location frontend

Write-Host "Instalando dependências do frontend..." -ForegroundColor Yellow
npm install

Write-Host "Criando build de produção..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao compilar frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Frontend compilado com sucesso" -ForegroundColor Green
Set-Location ..
Write-Host ""

# ═════════════════════════════════════════════════════════════
# Criar pacote distribuível
# ═════════════════════════════════════════════════════════════
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "PASSO 3/3: Criando Pacote Distribuível" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────────────" -ForegroundColor Cyan

$distDir = "dist"
$packageName = "StudyNotebook-Windows-v1.1.0"
$packageDir = "$distDir/$packageName"

# Criar estrutura de diretórios
Write-Host "Criando estrutura de diretórios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$packageDir/backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$packageDir/frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "$packageDir/database" | Out-Null
New-Item -ItemType Directory -Force -Path "$packageDir/uploads" | Out-Null

# Copiar backend
Write-Host "Copiando backend compilado..." -ForegroundColor Yellow
Copy-Item -Path "backend/dist" -Destination "$packageDir/backend/" -Recurse
Copy-Item -Path "backend/node_modules" -Destination "$packageDir/backend/" -Recurse
Copy-Item -Path "backend/package.json" -Destination "$packageDir/backend/"
Copy-Item -Path "backend/package-lock.json" -Destination "$packageDir/backend/"
Copy-Item -Path "backend/.env.example" -Destination "$packageDir/backend/.env"

# Copiar frontend
Write-Host "Copiando frontend compilado..." -ForegroundColor Yellow
Copy-Item -Path "frontend/dist" -Destination "$packageDir/frontend/" -Recurse

# Criar scripts de execução
Write-Host "Criando scripts de execução..." -ForegroundColor Yellow

# Script start.bat
@"
@echo off
echo ═══════════════════════════════════════════════════════════════
echo     STUDY NOTEBOOK - Iniciando Servidor
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend
echo Iniciando backend em http://localhost:3001...
node dist/index.js

pause
"@ | Out-File -FilePath "$packageDir/start.bat" -Encoding ASCII

# Script start-background.bat
@"
@echo off
echo Iniciando Study Notebook em background...
start /B node backend/dist/index.js
echo.
echo Servidor iniciado em http://localhost:3001
echo Frontend acessível via navegador
echo.
echo Para parar, feche esta janela ou use Ctrl+C
pause
"@ | Out-File -FilePath "$packageDir/start-background.bat" -Encoding ASCII

# README
@"
═══════════════════════════════════════════════════════════════
STUDY NOTEBOOK - v1.1.0
═══════════════════════════════════════════════════════════════

INSTALAÇÃO:
1. Certifique-se de ter Node.js 18+ instalado
   Download: https://nodejs.org

2. Execute start.bat para iniciar o servidor

3. Abra seu navegador em:
   http://localhost:3001

ESTRUTURA:
- backend/       → Servidor Node.js + Express
- frontend/      → Interface React (já compilada)
- database/      → Banco de dados SQLite
- uploads/       → Arquivos enviados (PDFs, etc)

SCRIPTS:
- start.bat              → Inicia servidor (janela visível)
- start-background.bat   → Inicia em background

DADOS:
- Banco de dados: database/database.sqlite
- Uploads: uploads/

SUPORTE:
- GitHub: https://github.com/seu-usuario/study-notebook
- Documentação: Ver RELATORIO_VALIDACAO.md

═══════════════════════════════════════════════════════════════
"@ | Out-File -FilePath "$packageDir/README.txt" -Encoding UTF8

Write-Host "✓ Pacote criado em: $packageDir" -ForegroundColor Green
Write-Host ""

# ═════════════════════════════════════════════════════════════
# Compactar em ZIP
# ═════════════════════════════════════════════════════════════
Write-Host "Compactando pacote..." -ForegroundColor Yellow

$zipFile = "$distDir/$packageName.zip"
Compress-Archive -Path "$packageDir/*" -DestinationPath $zipFile -Force

$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "✓ Pacote compactado: $zipFile ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green
Write-Host ""

# ═════════════════════════════════════════════════════════════
# Resumo
# ═════════════════════════════════════════════════════════════
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "    BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos gerados:" -ForegroundColor Yellow
Write-Host "  - Pasta: $packageDir" -ForegroundColor White
Write-Host "  - ZIP:   $zipFile" -ForegroundColor White
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Descompacte o ZIP em qualquer local" -ForegroundColor White
Write-Host "  2. Execute start.bat" -ForegroundColor White
Write-Host "  3. Acesse http://localhost:3001 no navegador" -ForegroundColor White
Write-Host ""
