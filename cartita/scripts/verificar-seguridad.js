/**
 * Script para verificar la configuración de seguridad
 * Ejecutar: node scripts/verificar-seguridad.js
 */

require('dotenv').config();

console.log('\n🔒 VERIFICACIÓN DE SEGURIDAD\n');
console.log('='.repeat(50));

let errores = 0;
let advertencias = 0;
let exitos = 0;

// Función para verificar
function verificar(nombre, condicion, mensaje, tipo = 'error') {
  if (condicion) {
    console.log(`✅ ${nombre}`);
    exitos++;
  } else {
    if (tipo === 'error') {
      console.log(`❌ ${nombre}: ${mensaje}`);
      errores++;
    } else {
      console.log(`⚠️  ${nombre}: ${mensaje}`);
      advertencias++;
    }
  }
}

console.log('\n📋 Variables de Entorno\n');

// JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
verificar(
  'JWT_SECRET existe',
  !!jwtSecret,
  'JWT_SECRET no está configurado'
);
verificar(
  'JWT_SECRET es fuerte',
  jwtSecret && jwtSecret.length >= 64,
  `JWT_SECRET debe tener al menos 64 caracteres (actual: ${jwtSecret?.length || 0})`
);
verificar(
  'JWT_SECRET no es el valor por defecto',
  jwtSecret && !jwtSecret.includes('tu-secreto'),
  'JWT_SECRET parece ser un valor de ejemplo'
);

// DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
verificar(
  'DATABASE_URL existe',
  !!databaseUrl,
  'DATABASE_URL no está configurado'
);
verificar(
  'DATABASE_URL usa protocolo seguro',
  databaseUrl && (databaseUrl.startsWith('mysql://') || databaseUrl.startsWith('postgresql://')),
  'DATABASE_URL debe usar mysql:// o postgresql://',
  'warning'
);

// EMAIL
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
verificar(
  'EMAIL_USER existe',
  !!emailUser,
  'EMAIL_USER no está configurado',
  'warning'
);
verificar(
  'EMAIL_PASSWORD existe',
  !!emailPassword,
  'EMAIL_PASSWORD no está configurado',
  'warning'
);
verificar(
  'EMAIL_PASSWORD parece ser App Password',
  emailPassword && emailPassword.length >= 16,
  'EMAIL_PASSWORD debería ser un App Password de Gmail (16 caracteres)',
  'warning'
);

// URLs públicas
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
verificar(
  'NEXT_PUBLIC_API_URL existe',
  !!apiUrl,
  'NEXT_PUBLIC_API_URL no está configurado',
  'warning'
);

if (process.env.NODE_ENV === 'production') {
  verificar(
    'NEXT_PUBLIC_API_URL usa HTTPS',
    apiUrl && apiUrl.startsWith('https://'),
    'En producción, NEXT_PUBLIC_API_URL debe usar HTTPS'
  );
}

console.log('\n🔐 Configuración de Seguridad\n');

// Verificar archivos críticos
const fs = require('fs');
const path = require('path');

const archivosImportantes = [
  'src/lib/middleware.js',
  'src/lib/security.js',
  'src/middleware.js',
  'next.config.js'
];

archivosImportantes.forEach(archivo => {
  const rutaCompleta = path.join(process.cwd(), archivo);
  verificar(
    `Archivo ${archivo} existe`,
    fs.existsSync(rutaCompleta),
    `Archivo crítico ${archivo} no encontrado`
  );
});

// Verificar que .env no esté en Git
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  verificar(
    '.env está en .gitignore',
    gitignoreContent.includes('.env'),
    '.env debe estar en .gitignore para no commitear secrets'
  );
}

console.log('\n📦 Dependencias\n');

// Verificar package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  verificar(
    'bcryptjs instalado',
    !!dependencies.bcryptjs,
    'bcryptjs es necesario para hashear passwords',
    'warning'
  );
  
  verificar(
    'jsonwebtoken instalado',
    !!dependencies.jsonwebtoken,
    'jsonwebtoken es necesario para JWT',
    'warning'
  );
  
  verificar(
    '@prisma/client instalado',
    !!dependencies['@prisma/client'],
    '@prisma/client es necesario para la base de datos',
    'warning'
  );
}

console.log('\n' + '='.repeat(50));
console.log('\n📊 RESUMEN\n');
console.log(`✅ Verificaciones exitosas: ${exitos}`);
console.log(`⚠️  Advertencias: ${advertencias}`);
console.log(`❌ Errores críticos: ${errores}`);

if (errores > 0) {
  console.log('\n❌ HAY ERRORES CRÍTICOS QUE DEBEN CORREGIRSE');
  console.log('La aplicación NO es segura para producción.\n');
  process.exit(1);
} else if (advertencias > 0) {
  console.log('\n⚠️  HAY ADVERTENCIAS QUE DEBERÍAN REVISARSE');
  console.log('La aplicación puede funcionar pero hay mejoras recomendadas.\n');
  process.exit(0);
} else {
  console.log('\n✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('La configuración de seguridad es correcta.\n');
  process.exit(0);
}
