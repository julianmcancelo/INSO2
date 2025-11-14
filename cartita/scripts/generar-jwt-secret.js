/**
 * Script para generar un JWT_SECRET seguro
 * Ejecutar: node scripts/generar-jwt-secret.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('\n🔐 GENERADOR DE JWT_SECRET SEGURO\n');
console.log('='.repeat(50));

// Generar un JWT_SECRET de 128 caracteres (64 bytes)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ JWT_SECRET generado exitosamente!\n');
console.log('Longitud:', jwtSecret.length, 'caracteres');
console.log('\nTu nuevo JWT_SECRET es:\n');
console.log('─'.repeat(50));
console.log(jwtSecret);
console.log('─'.repeat(50));

// Intentar actualizar el archivo .env
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('\n📝 Actualizando archivos de entorno...\n');

function updateEnvFile(filePath, fileName) {
  try {
    if (fs.existsSync(filePath)) {
      let envContent = fs.readFileSync(filePath, 'utf8');
      
      // Verificar si JWT_SECRET ya existe
      if (envContent.includes('JWT_SECRET=')) {
        // Reemplazar el valor existente
        envContent = envContent.replace(
          /JWT_SECRET=.*/g,
          `JWT_SECRET="${jwtSecret}"`
        );
        console.log(`✅ ${fileName}: JWT_SECRET actualizado`);
      } else {
        // Agregar JWT_SECRET al final
        envContent += `\n# JWT Secret (generado automáticamente)\nJWT_SECRET="${jwtSecret}"\n`;
        console.log(`✅ ${fileName}: JWT_SECRET agregado`);
      }
      
      fs.writeFileSync(filePath, envContent, 'utf8');
      return true;
    } else {
      console.log(`⚠️  ${fileName}: Archivo no existe`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${fileName}: Error al actualizar - ${error.message}`);
    return false;
  }
}

// Actualizar .env
const envUpdated = updateEnvFile(envPath, '.env');

// Actualizar .env.local si existe
const envLocalUpdated = updateEnvFile(envLocalPath, '.env.local');

console.log('\n' + '='.repeat(50));

if (envUpdated || envLocalUpdated) {
  console.log('\n✅ CONFIGURACIÓN COMPLETADA\n');
  console.log('El JWT_SECRET ha sido actualizado en tus archivos de entorno.');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   - Reinicia el servidor de desarrollo (npm run dev)');
  console.log('   - NO compartas este JWT_SECRET con nadie');
  console.log('   - NO lo subas a Git (ya está en .gitignore)');
  console.log('\n💡 Para verificar la seguridad, ejecuta:');
  console.log('   npm run security:check\n');
} else {
  console.log('\n⚠️  NO SE PUDO ACTUALIZAR AUTOMÁTICAMENTE\n');
  console.log('Por favor, copia el JWT_SECRET de arriba y agrégalo manualmente a tu archivo .env:');
  console.log('\nJWT_SECRET="' + jwtSecret + '"\n');
}
