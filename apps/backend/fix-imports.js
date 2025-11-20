const fs = require('fs');
const path = require('path');

function getRelativePath(fromFile) {
  // Desde cualquier archivo en backend/dist, calculamos cuántos ../ necesitamos
  const fromDir = path.dirname(fromFile);
  const distDir = path.resolve(__dirname, 'dist');
  
  // Obtener path relativo desde el archivo hasta dist/
  const rel = path.relative(fromDir, distDir);
  
  // Contar cuántos niveles subimos
  const levels = rel.split(path.sep).filter(p => p === '..').length;
  
  // Desde dist necesitamos: ../ (dist) + ../ (backend) + ../ (apps) = 3 más
  return '../'.repeat(levels + 3);
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const pathToRoot = getRelativePath(filePath);
  
  // Reemplazar todos los imports de @hotel/domain
  content = content.replace(
    /@hotel\/domain\/src\//g,
    `${pathToRoot}domain/dist/`
  );
  
  content = content.replace(
    /require\(['"]@hotel\/domain['"]\)/g,
    `require('${pathToRoot}domain/dist')`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath} -> using ${pathToRoot}domain/dist/`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      replaceInFile(filePath);
    }
  });
}

console.log('🔧 Fixing imports...');
walkDir('./dist');
console.log('✅ All imports fixed!');