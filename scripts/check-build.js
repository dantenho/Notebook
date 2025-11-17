// Check if build is ready before packaging
const fs = require('fs');
const path = require('path');

const checks = [
  { path: 'backend/dist/index.js', name: 'Backend build' },
  { path: 'frontend/dist/index.html', name: 'Frontend build' },
  { path: 'electron/main.js', name: 'Electron main' },
];

console.log('🔍 Checking build requirements...\n');

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, '..', check.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✅ ${check.name}: OK`);
  } else {
    console.log(`❌ ${check.name}: NOT FOUND (${check.path})`);
    allGood = false;
  }
});

console.log('');

if (!allGood) {
  console.log('❌ Build incomplete. Run: npm run build');
  process.exit(1);
}

console.log('✅ All checks passed!\n');
