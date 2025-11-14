/**
 * Script para generar JWT_SECRET diferentes para desarrollo y producción
 * Ejecutar: node scripts/generar-jwt-separados.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('\n🔐 GENERADOR DE JWT_SECRET PARA DESARROLLO Y PRODUCCIÓN\n');
console.log('='.repeat(60));

// Generar dos JWT_SECRET diferentes
const jwtSecretDev = crypto.randomBytes(64).toString('hex');
const jwtSecretProd = crypto.randomBytes(64).toString('hex');

console.log('\n✅ JWT_SECRET generados exitosamente!\n');

console.log('📝 DESARROLLO (.env.local):');
console.log('─'.repeat(60));
console.log(jwtSecretDev);
console.log('─'.repeat(60));

console.log('\n🚀 PRODUCCIÓN (.env.production.example):');
console.log('─'.repeat(60));
console.log(jwtSecretProd);
console.log('─'.repeat(60));

// Actualizar .env.local (desarrollo)
const envLocalPath = path.join(__dirname, '..', '.env.local');
console.log('\n📝 Actualizando archivos...\n');

try {
  if (fs.existsSync(envLocalPath)) {
    let envContent = fs.readFileSync(envLocalPath, 'utf8');
    
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(
        /JWT_SECRET=.*/g,
        `JWT_SECRET="${jwtSecretDev}"`
      );
    } else {
      envContent += `\n# JWT Secret para DESARROLLO (generado automáticamente)\nJWT_SECRET="${jwtSecretDev}"\n`;
    }
    
    fs.writeFileSync(envLocalPath, envContent, 'utf8');
    console.log('✅ .env.local: JWT_SECRET de DESARROLLO actualizado');
  } else {
    // Crear .env.local si no existe
    const content = `# Desarrollo - Variables de Entorno Locales
# Este archivo NO se sube a Git

# JWT Secret para DESARROLLO
JWT_SECRET="${jwtSecretDev}"
`;
    fs.writeFileSync(envLocalPath, content, 'utf8');
    console.log('✅ .env.local: Creado con JWT_SECRET de DESARROLLO');
  }
} catch (error) {
  console.log('❌ Error al actualizar .env.local:', error.message);
}

// Actualizar .env.production.example (template para producción)
const envProdExamplePath = path.join(__dirname, '..', '.env.production.example');

try {
  if (fs.existsSync(envProdExamplePath)) {
    let envContent = fs.readFileSync(envProdExamplePath, 'utf8');
    
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(
        /JWT_SECRET=.*/g,
        `JWT_SECRET="${jwtSecretProd}"`
      );
    } else {
      // Buscar la sección de JWT y reemplazar
      if (envContent.includes('GENERA_UNA_CLAVE')) {
        envContent = envContent.replace(
          /JWT_SECRET="GENERA_UNA_CLAVE[^"]*"/g,
          `JWT_SECRET="${jwtSecretProd}"`
        );
      } else {
        envContent += `\nJWT_SECRET="${jwtSecretProd}"\n`;
      }
    }
    
    fs.writeFileSync(envProdExamplePath, envContent, 'utf8');
    console.log('✅ .env.production.example: JWT_SECRET de PRODUCCIÓN actualizado');
  }
} catch (error) {
  console.log('❌ Error al actualizar .env.production.example:', error.message);
}

// Crear archivo de instrucciones para Vercel
const vercelInstructionsPath = path.join(__dirname, '..', 'JWT_PRODUCCION.txt');
const vercelInstructions = `🔐 JWT_SECRET PARA PRODUCCIÓN (VERCEL)
${'='.repeat(60)}

⚠️  IMPORTANTE: Este JWT_SECRET es SOLO para producción.
    NO lo uses en desarrollo.

Copia este valor EXACTAMENTE como está (sin comillas adicionales):

${jwtSecretProd}

${'='.repeat(60)}

📋 INSTRUCCIONES PARA VERCEL:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega una nueva variable:
   - Name: JWT_SECRET
   - Value: [pega el JWT_SECRET de arriba]
   - Environment: Production (y Preview si quieres)
4. Guarda los cambios
5. Redeploy tu aplicación

⚠️  DESPUÉS DE CONFIGURAR:
   - Elimina este archivo (JWT_PRODUCCION.txt)
   - NO lo subas a Git
   - NO lo compartas con nadie

${'='.repeat(60)}
`;

fs.writeFileSync(vercelInstructionsPath, vercelInstructions, 'utf8');
console.log('✅ JWT_PRODUCCION.txt: Creado con instrucciones para Vercel');

console.log('\n' + '='.repeat(60));
console.log('\n✅ CONFIGURACIÓN COMPLETADA\n');
console.log('📋 Resumen:');
console.log('   • Desarrollo (.env.local): JWT_SECRET actualizado');
console.log('   • Producción (.env.production.example): JWT_SECRET actualizado');
console.log('   • JWT_PRODUCCION.txt: Instrucciones creadas');
console.log('\n⚠️  IMPORTANTE:');
console.log('   1. Reinicia el servidor de desarrollo (npm run dev)');
console.log('   2. Para producción, sigue las instrucciones en JWT_PRODUCCION.txt');
console.log('   3. Después de configurar Vercel, ELIMINA JWT_PRODUCCION.txt');
console.log('\n💡 Para verificar:');
console.log('   npm run security:check\n');
