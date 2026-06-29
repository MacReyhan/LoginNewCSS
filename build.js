const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Compile TypeScript using esbuild
try {
  console.log('Compiling TypeScript...');
  esbuild.buildSync({
    entryPoints: [path.join(srcDir, 'index.ts')],
    bundle: true,
    minify: true,
    outfile: path.join(distDir, 'index.js'),
    platform: 'browser',
    target: ['es2022'],
  });
  console.log('TypeScript compilation completed successfully.');
} catch (e) {
  console.error('TypeScript compilation failed:', e);
  process.exit(1);
}

// Copy static files
const filesToCopy = [
  { src: 'index.html', dest: 'index.html' },
  { src: 'manifest.json', dest: 'manifest.json' },
  { src: '../android/app/src/main/ic_launcher-playstore.png', dest: 'ic_launcher-playstore.png' }
];

filesToCopy.forEach(file => {
  const srcPath = path.resolve(srcDir, file.src);
  const destPath = path.resolve(distDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} to dist/${file.dest}`);
  } else {
    console.warn(`Warning: Source file ${srcPath} does not exist.`);
  }
});
