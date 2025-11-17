# Como Criar Ícones para Study Notebook

## Ícone Recomendado

**Design:**
- 📚 Caderno aberto (elemento principal)
- 🤖 Símbolo de IA (canto superior direito)
- 🎓 Elemento médico sutil (cruz ou similar)

**Cores:**
- Primary: #3b82f6 (Azul - Tech/Confiança)
- Accent: #10b981 (Verde - Medicina/Saúde)
- Background: Branco ou gradiente suave

## Opção 1: Criar Online (Mais Fácil)

1. **Criar ícone 512x512px:**
   - Use Canva (https://canva.com)
   - Use Figma (https://figma.com)
   - Use qualquer editor de imagens

2. **Converter para todos os formatos:**
   - Acesse: https://www.electronjs.org/docs/latest/tutorial/icons
   - Ou use: https://icon.kitchen/
   - Faça upload do PNG 512x512
   - Baixe .ico (Windows), .icns (macOS), .png (Linux)

3. **Colocar nesta pasta:**
   ```
   build/icon.ico   # Windows
   build/icon.icns  # macOS
   build/icon.png   # Linux (512x512)
   ```

## Opção 2: Usar Ferramenta CLI

```bash
# Instalar electron-icon-builder
npm install -g electron-icon-builder

# Criar ícone 1024x1024 chamado source-icon.png

# Gerar todos os formatos
electron-icon-builder --input=source-icon.png --output=build
```

## Opção 3: Usar Script PowerShell (Windows)

```powershell
# Converter PNG para ICO
# Requer ImageMagick: choco install imagemagick
convert source-icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

## Opção 4: Placeholder Temporário

Para desenvolvimento, criar um ícone simples com texto:

**Windows (.ico):**
- Use site: https://convertico.com/
- Upload qualquer imagem
- Download .ico

**macOS (.icns):**
- Em macOS, use:
  ```bash
  mkdir icon.iconset
  # Criar múltiplos tamanhos e salvar em icon.iconset/
  iconutil -c icns icon.iconset
  ```

**Linux (.png):**
- Apenas um PNG 512x512

## Verificar Ícones

Após criar, verifique:

```bash
# Windows
file build/icon.ico
# Deve mostrar: MS Windows icon resource

# macOS
file build/icon.icns
# Deve mostrar: Mac OS X icon

# Linux
file build/icon.png
identify build/icon.png
# Deve ser 512x512 PNG
```

## Ícone Atual (Placeholder)

Os ícones atuais são placeholders. Para release de produção:

1. Crie ícones profissionais
2. Teste em cada plataforma
3. Substitua os placeholders
4. Rebuild: `npm run build && npm run package:win`

## Recursos Gratuitos

**Ícones base:**
- https://heroicons.com/ (MIT license)
- https://lucide.dev/ (ISC license)
- https://fontawesome.com/icons (algumas grátis)

**Editores online:**
- Canva (templates grátis)
- Photopea (similar ao Photoshop, grátis)
- GIMP (desktop, open source)

## Exemplo Rápido com AI

Prompt para DALL-E/Midjourney/Stable Diffusion:

```
"Modern minimalist app icon for medical study notebook application,
blue gradient background, white open book in center, small brain icon
representing AI, medical cross symbol, clean professional design,
flat style, 1024x1024px, white background"
```

Depois só converter para os formatos necessários!
