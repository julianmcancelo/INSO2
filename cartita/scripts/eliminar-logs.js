/**
 * Script para eliminar todos los console.log/error/warn de los archivos API
 * Ejecutar: node scripts/eliminar-logs.js
 */

const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// Patrones a eliminar
const patterns = [
  // console.log con contenido
  /\s*console\.log\([^)]*\);?\n?/g,
  // console.error con contenido
  /\s*console\.error\([^)]*\);?\n?/g,
  // console.warn con contenido
  /\s*console\.warn\([^)]*\);?\n?/g,
  // console.info con contenido
  /\s*console\.info\([^)]*\);?\n?/g,
  // console.debug con contenido
  /\s*console\.debug\([^)]*\);?\n?/g,
];

// Comentarios a mantener (no eliminar)
const keepComments = [
  '// No loguear',
  '// No exponer',
  '// Sin logs',
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // Aplicar cada patrón
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Solo escribir si hubo cambios
    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${path.relative(process.cwd(), filePath)}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return 0;
  }
}

function walkDir(dir) {
  let filesProcessed = 0;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      filesProcessed += walkDir(filePath);
    } else if (file.endsWith('.js') && file !== 'eliminar-logs.js') {
      filesProcessed += processFile(filePath);
    }
  });
  
  return filesProcessed;
}

console.log('\n🧹 ELIMINANDO LOGS DE PRODUCCIÓN\n');
console.log('='.repeat(50));
console.log(`\nBuscando en: ${apiDir}\n`);

const filesModified = walkDir(apiDir);

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Archivos modificados: ${filesModified}`);
console.log('\n💡 Los logs han sido eliminados de los archivos API.');
console.log('   Solo se mantendrán comentarios de seguridad.\n');
