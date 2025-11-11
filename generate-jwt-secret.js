// Script para generar un JWT Secret seguro
// Ejecutar con: node generate-jwt-secret.js

const crypto = require('crypto');

function generateJWTSecret() {
  // Generar 64 bytes aleatorios y convertir a hex
  const secret = crypto.randomBytes(64).toString('hex');
  return secret;
}

console.log('🔐 Generando JWT Secret seguro...\n');
console.log('Copia este valor y úsalo como JWT_SECRET en tus variables de entorno:\n');
console.log('━'.repeat(80));
console.log(generateJWTSecret());
console.log('━'.repeat(80));
console.log('\n✅ Secret generado exitosamente');
console.log('\n📝 Agrégalo en Railway → Variables → JWT_SECRET');
