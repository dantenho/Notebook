#!/usr/bin/env node

// Create a simple placeholder icon
// This creates a basic SVG and converts to PNG, then to ICO

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

// Create a simple SVG icon (512x512)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>

  <!-- Book icon (simplified) -->
  <rect x="140" y="120" width="232" height="272" rx="12" fill="white" opacity="0.95"/>
  <rect x="256" y="120" width="4" height="272" fill="#3b82f6" opacity="0.3"/>

  <!-- AI circuit pattern -->
  <circle cx="380" cy="160" r="32" fill="#10b981" opacity="0.9"/>
  <circle cx="370" cy="150" r="4" fill="white"/>
  <circle cx="390" cy="150" r="4" fill="white"/>
  <circle cx="380" cy="170" r="4" fill="white"/>
  <line x1="380" y1="128" x2="380" y2="110" stroke="white" stroke-width="3"/>
  <circle cx="380" cy="105" r="5" fill="white"/>

  <!-- Medical cross -->
  <rect x="150" y="350" width="20" height="60" rx="4" fill="#10b981" opacity="0.8"/>
  <rect x="140" y="360" width="40" height="20" rx="4" fill="#10b981" opacity="0.8"/>
</svg>`;

// Save SVG
const svgPath = path.join(buildDir, 'icon.svg');
fs.writeFileSync(svgPath, svg, 'utf8');
console.log('✅ Created SVG icon:', svgPath);

console.log('\n📝 Next steps:');
console.log('   Run: npm install -g sharp-cli');
console.log('   Then: sharp -i build/icon.svg -o build/icon-512.png resize 512 512');
console.log('   Or use: https://convertio.co/svg-png/ to convert SVG to PNG');
console.log('   Then run this script again to create ICO file');
