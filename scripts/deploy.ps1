# Script de Deploy Robusto para Hostinger (Palaz Portfolio)
# Garante que os arquivos do Editor sejam restaurados mesmo em caso de erro na build.

$ErrorActionPreference = "Stop"
$env:NEXT_EXPORT = "1"

function SafeMove($src, $dest) {
    if (Test-Path $src) {
        Write-Host "Movendo $src para $dest..." -ForegroundColor Cyan
        Move-Item $src $dest -Force
    }
}

$disabledDir = "src/app_disabled"

try {
    # 1. Limpeza inicial
    if (Test-Path $disabledDir) { 
        Remove-Item -Recurse -Force $disabledDir 
    }
    New-Item -ItemType Directory $disabledDir | Out-Null

    # 2. Esconder rotas dinâmicas (que quebram a build estática)
    SafeMove "src/app/api" "$disabledDir/"
    SafeMove "src/app/editor" "$disabledDir/"
    SafeMove "src/app/sitemap.ts" "$disabledDir/"
    SafeMove "src/app/robots.ts" "$disabledDir/"

    # 2.5 Limpar cache do Next.js para evitar erros de renderização fantasma
    if (Test-Path ".next") {
        Write-Host "Limpando cache do Next.js (.next)..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force ".next"
    }

    # 2.6 Verificação de Sanidade
    Write-Host "Verificando arquivos em src/app antes da build:" -ForegroundColor Gray
    Get-ChildItem "src/app" | Select-Object Name | Write-Host -ForegroundColor Gray

    # 3. Executar a Build do Next.js
    Write-Host "Iniciando Next.js Build (Static Export)..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Next.js build failed with exit code $LASTEXITCODE"
    }

    Write-Host "Build concluída com sucesso!" -ForegroundColor Green
}
catch {
    Write-Host "ERRO durante a build: $($_.Exception.Message)" -ForegroundColor Red
    # O bloco finally cuidará da restauração
}
finally {
    Write-Host "Restaurando arquivos do Editor..." -ForegroundColor Cyan
    
    # 4. Restaurar arquivos independente do resultado da build
    SafeMove "$disabledDir/api" "src/app/"
    SafeMove "$disabledDir/editor" "src/app/"
    SafeMove "$disabledDir/sitemap.ts" "src/app/"
    SafeMove "$disabledDir/robots.ts" "src/app/"
    
    if (Test-Path $disabledDir) { 
        Remove-Item -Recurse -Force $disabledDir 
    }
    Write-Host "Ambiente de desenvolvimento restaurado." -ForegroundColor Cyan
}

# 5. Finalizar a pasta dist
if (Test-Path "out") {
    Write-Host "Finalizando estrutura da pasta dist..." -ForegroundColor Green
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    Move-Item "out" "dist"
    
    # Copiar assets estáticos adicionais
    $assets = @(".htaccess", "index.html", "robots.txt", "sitemap.xml")
    foreach ($file in $assets) {
        if (Test-Path "public/$file") {
            Copy-Item "public/$file" "dist/$file" -Force
        }
    }
    Write-Host "Deploy pronto em /dist para upload manual!" -ForegroundColor Green
}
else {
    Write-Host "A pasta /out não foi gerada. Verifique os erros acima." -ForegroundColor Red
}
