# Ícones do Aplicativo

Esta pasta deve conter os ícones do aplicativo nos formatos:

- `icon.png` - Ícone principal (512x512px ou maior) para Linux
- `icon.ico` - Ícone para Windows (contém múltiplos tamanhos)
- `icon.icns` - Ícone para macOS (contém múltiplos tamanhos)

## Como criar os ícones:

### Opção 1: Usar ferramenta online
1. Criar ícone 512x512px em qualquer editor (Figma, Canva, etc.)
2. Usar https://www.electronjs.org/docs/latest/tutorial/icon para converter

### Opção 2: Usar electron-icon-builder
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon-source.png --output=./build
```

### Opção 3: Manual
- **Windows (.ico)**: Usar ferramenta como https://convertico.com/
- **macOS (.icns)**: Usar Icns Composer ou `iconutil` no macOS
- **Linux (.png)**: Apenas garantir que seja 512x512px

## Design sugerido:

Ícone deve representar:
- 📚 Notebook/Caderno (elemento principal)
- 🤖 IA/Tech (elemento secundário)
- 🎓 Medicina/Estudo (cor ou símbolo)

Cores sugeridas:
- Azul (#3b82f6) - Tech/Confiança
- Verde (#10b981) - Medicina/Saúde
- Branco - Limpo/Profissional

## Placeholder atual:

Os arquivos nesta pasta são placeholders. Substitua por ícones reais antes de fazer o build final para distribuição.
