#!/bin/bash

# Windows Release Builder for Study Notebook
# Creates Windows installer (.exe) ready for distribution

set -e

echo "🚀 Study Notebook - Windows Release Builder"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if on Windows or has wine (for testing)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo -e "${BLUE}ℹ${NC} Not on Windows. Cross-compiling for Windows..."
fi

# Clean previous builds
echo -e "${BLUE}🧹${NC} Cleaning previous builds..."
npm run clean 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦${NC} Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦${NC} Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦${NC} Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Build backend
echo ""
echo -e "${BLUE}🔨${NC} Building backend..."
cd backend
npm run build
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}❌${NC} Backend build failed!"
    exit 1
fi
cd ..
echo -e "${GREEN}✅${NC} Backend built successfully"

# Build frontend
echo ""
echo -e "${BLUE}🔨${NC} Building frontend..."
cd frontend
npm run build
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌${NC} Frontend build failed!"
    exit 1
fi
cd ..
echo -e "${GREEN}✅${NC} Frontend built successfully"

# Package for Windows
echo ""
echo -e "${BLUE}📦${NC} Creating Windows installer..."
echo "This may take a few minutes..."
npm run release:win

# Check if installer was created
if [ -f "dist-electron/Study Notebook-Setup-1.0.0.exe" ]; then
    echo ""
    echo -e "${GREEN}✅ Windows installer created successfully!${NC}"
    echo ""
    echo "📦 Installer location:"
    echo "   dist-electron/Study Notebook-Setup-1.0.0.exe"
    echo ""
    echo "📊 File size:"
    ls -lh "dist-electron/Study Notebook-Setup-1.0.0.exe" | awk '{print "   " $5}'
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Test the installer on Windows 11"
    echo "   2. Distribute to users"
    echo "   3. Create GitHub release"
    echo ""
else
    echo -e "${RED}❌ Installer not found!${NC}"
    echo "Check dist-electron/ for any files created"
    ls -la dist-electron/ 2>/dev/null || echo "dist-electron/ is empty or doesn't exist"
    exit 1
fi
