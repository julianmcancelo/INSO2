/**
 * Script de auditoría de seguridad completa
 * Ejecutar: node scripts/audit-seguridad.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 AUDITORÍA DE SEGURIDAD COMPLETA\n');
console.log('='.repeat(60));

let errores = 0;
let advertencias = 0;

// 1. Auditar dependencias npm
console.log('\n📦 1. Auditando dependencias npm...\n');
try {
  const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
  const audit = JSON.parse(auditResult);
  
  if (audit.metadata.vulnerabilities.total === 0) {
    console.log('✅ No se encontraron vulnerabilidades');
  } else {
    const { info, low, moderate, high, critical } = audit.metadata.vulnerabilities;
    
    if (critical > 0) {
      console.log(`🔴 CRÍTICAS: ${critical}`);
      errores += critical;
    }
    if (high > 0) {
      console.log(`🟠 ALTAS: ${high}`);
      errores += high;
    }
    if (moderate > 0) {
      console.log(`🟡 MODERADAS: ${moderate}`);
      advertencias += moderate;
    }
    if (low > 0) {
      console.log(`🟢 BAJAS: ${low}`);
    }
    if (info > 0) {
      console.log(`ℹ️  INFO: ${info}`);
    }
    
    console.log('\n💡 Ejecuta: npm audit fix');
  }
} catch (error) {
  console.log('⚠️  Error al auditar dependencias');
  advertencias++;
}

// 2. Verificar archivos sensibles
console.log('\n🔒 2. Verificando archivos sensibles...\n');

const archivosSensibles = [
  '.env',
  '.env.local',
  '.env.production',
  'JWT_PRODUCCION.txt',
  'node_modules',
  '.next'
];

const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  
  archivosSensibles.forEach(archivo => {
    if (gitignore.includes(archivo)) {
      console.log(`✅ ${archivo} está en .gitignore`);
    } else {
      console.log(`❌ ${archivo} NO está en .gitignore`);
      errores++;
    }
  });
} else {
  console.log('❌ .gitignore no existe');
  errores++;
}

// 3. Verificar variables de entorno
console.log('\n🔐 3. Verificando variables de entorno...\n');

const variablesCriticas = [
  'JWT_SECRET',
  'DATABASE_URL'
];

// Cargar .env
function loadEnv(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
        env[key] = value;
      }
    });
  }
  return env;
}

const env = {
  ...loadEnv(path.join(process.cwd(), '.env')),
  ...loadEnv(path.join(process.cwd(), '.env.local'))
};

variablesCriticas.forEach(variable => {
  if (env[variable]) {
    console.log(`✅ ${variable} configurado`);
    
    // Verificar que no sea un valor de ejemplo
    if (env[variable].includes('ejemplo') || 
        env[variable].includes('example') || 
        env[variable].includes('GENERA_UNA_CLAVE')) {
      console.log(`   ⚠️  Parece ser un valor de ejemplo`);
      advertencias++;
    }
  } else {
    console.log(`❌ ${variable} NO configurado`);
    errores++;
  }
});

// 4. Verificar archivos de seguridad
console.log('\n🛡️  4. Verificando archivos de seguridad...\n');

const archivosSeguridad = [
  'src/lib/middleware.js',
  'src/lib/security.js',
  'src/middleware.js',
  'next.config.js'
];

archivosSeguridad.forEach(archivo => {
  const rutaCompleta = path.join(process.cwd(), archivo);
  if (fs.existsSync(rutaCompleta)) {
    console.log(`✅ ${archivo} existe`);
  } else {
    console.log(`❌ ${archivo} NO existe`);
    errores++;
  }
});

// 5. Buscar console.log en producción
console.log('\n📝 5. Buscando console.log en código...\n');

try {
  const result = execSync('git ls-files "src/**/*.js" "src/**/*.jsx" | xargs grep -l "console\\." || echo "none"', 
    { encoding: 'utf8', cwd: process.cwd() }
  );
  
  if (result.trim() === 'none' || result.trim() === '') {
    console.log('✅ No se encontraron console.log en el código');
  } else {
    const archivos = result.trim().split('\n').filter(f => f);
    console.log(`⚠️  Se encontraron console.log en ${archivos.length} archivo(s):`);
    archivos.slice(0, 5).forEach(f => console.log(`   - ${f}`));
    if (archivos.length > 5) {
      console.log(`   ... y ${archivos.length - 5} más`);
    }
    advertencias += archivos.length;
  }
} catch (error) {
  console.log('ℹ️  No se pudo verificar console.log (requiere git)');
}

// 6. Verificar dependencias desactualizadas
console.log('\n📊 6. Verificando dependencias desactualizadas...\n');

try {
  const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
  const packages = JSON.parse(outdated);
  const count = Object.keys(packages).length;
  
  if (count === 0) {
    console.log('✅ Todas las dependencias están actualizadas');
  } else {
    console.log(`⚠️  ${count} dependencia(s) desactualizada(s)`);
    Object.keys(packages).slice(0, 5).forEach(pkg => {
      console.log(`   - ${pkg}: ${packages[pkg].current} → ${packages[pkg].latest}`);
    });
    if (count > 5) {
      console.log(`   ... y ${count - 5} más`);
    }
    advertencias += Math.min(count, 10);
  }
} catch (error) {
  // npm outdated devuelve exit code 1 si hay paquetes desactualizados
  console.log('ℹ️  Hay dependencias desactualizadas. Ejecuta: npm outdated');
}

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('\n📊 RESUMEN DE AUDITORÍA\n');
console.log(`✅ Verificaciones completadas`);
console.log(`⚠️  Advertencias: ${advertencias}`);
console.log(`❌ Errores críticos: ${errores}`);

if (errores === 0 && advertencias === 0) {
  console.log('\n🎉 ¡Excelente! No se encontraron problemas de seguridad.\n');
  process.exit(0);
} else if (errores === 0) {
  console.log('\n✅ No hay errores críticos, pero revisa las advertencias.\n');
  process.exit(0);
} else {
  console.log('\n❌ Se encontraron errores críticos que deben corregirse.\n');
  process.exit(1);
}
