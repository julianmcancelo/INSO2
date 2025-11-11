# Script de Despliegue a Vercel - Cartita
# Ejecutar con: .\deploy-vercel.ps1

Write-Host "🚀 Iniciando despliegue de Cartita a Vercel..." -ForegroundColor Cyan

# Verificar si Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI no está instalado" -ForegroundColor Red
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navegar al directorio del frontend
Set-Location -Path ".\frontend"

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Construyendo aplicación..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
    
    # Volver al directorio raíz
    Set-Location -Path ".."
    
    Write-Host "🌐 Desplegando a Vercel..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Asegúrate de configurar las variables de entorno:" -ForegroundColor Yellow
    Write-Host "   - REACT_APP_API_URL" -ForegroundColor White
    Write-Host "   - REACT_APP_SOCKET_URL" -ForegroundColor White
    Write-Host ""
    
    # Desplegar
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡Despliegue exitoso!" -ForegroundColor Green
        Write-Host "🎉 Tu aplicación está en línea" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    Set-Location -Path ".."
}
