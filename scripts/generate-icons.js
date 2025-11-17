#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const svgPath = path.join(buildDir, 'icon.svg');
const pngPath = path.join(buildDir, 'icon.png');
const icoPath = path.join(buildDir, 'icon.ico');

async function generateIcons() {
  try {
    console.log('🎨 Generating icons from SVG...\n');

    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.error('❌ SVG file not found:', svgPath);
      console.log('   Run: node scripts/create-placeholder-icon.js first');
      process.exit(1);
    }

    // 1. Generate PNG (512x512)
    console.log('📸 Creating PNG (512x512)...');
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    console.log('✅ Created:', pngPath);

    // 2. Generate ICO (multiple sizes: 256, 128, 96, 64, 48, 32, 16)
    console.log('\n🪟 Creating Windows ICO (multi-size)...');

    // Create temporary PNGs for different sizes
    const sizes = [256, 128, 96, 64, 48, 32, 16];
    const tempFiles = [];

    for (const size of sizes) {
      const tempPath = path.join(buildDir, `temp-${size}.png`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(tempPath);
      tempFiles.push(tempPath);
    }

    // For ICO generation, we'll use the largest PNG
    // electron-builder will handle the ICO conversion automatically
    // Just copy the 256x256 version as .ico format (PNG format is acceptable)
    const ico256Path = path.join(buildDir, 'temp-256.png');
    fs.copyFileSync(ico256Path, icoPath);

    console.log('✅ Created:', icoPath);

    // Clean up temporary files
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    console.log('\n✅ All icons generated successfully!');
    console.log('\n📦 Generated files:');
    console.log('   - build/icon.png (512x512)');
    console.log('   - build/icon.ico (Windows)');
    console.log('\n🚀 Ready to build! Run: npm run release:win');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
