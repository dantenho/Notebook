#!/bin/bash

# Development script for Study Notebook Desktop App

set -e

echo "🚀 Study Notebook - Development Mode"
echo "======================================"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencies installed"
echo ""
echo "Starting development servers..."
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo "  Electron: Opening desktop app..."
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start all processes
npm run dev
