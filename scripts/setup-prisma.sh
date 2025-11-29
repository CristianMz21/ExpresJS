#!/bin/bash

# Script para configurar Prisma en el proyecto Hospital

echo "🔧 Configurando Prisma para Hospital Database..."
echo ""

# Verificar si Prisma está instalado
echo "📦 Verificando instalación de Prisma..."
if ! npm list @prisma/client > /dev/null 2>&1; then
    echo "⚠️  Prisma Client no encontrado. Instalando..."
    npm install @prisma/client
fi

if ! npm list -D prisma > /dev/null 2>&1; then
    echo "⚠️  Prisma CLI no encontrado. Instalando..."
    npm install -D prisma
fi

echo ""
echo "✅ Prisma instalado correctamente"
echo ""

# Generar cliente de Prisma
echo "🔨 Generando Prisma Client..."
npx prisma generate

echo ""
echo "📊 Aplicando schema a la base de datos..."
echo "Opciones:"
echo "  1) npx prisma db push (rápido, sin migraciones)"
echo "  2) npx prisma migrate dev --name init (con migraciones)"
echo ""
read -p "Selecciona una opción (1 o 2): " option

if [ "$option" = "1" ]; then
    npx prisma db push
elif [ "$option" = "2" ]; then
    npx prisma migrate dev --name init
else
    echo "❌ Opción inválida"
    exit 1
fi

echo ""
echo "✅ ¡Prisma configurado exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "  - Ejecuta 'npx prisma studio' para ver tus datos"
echo "  - Consulta PRISMA_SETUP.md para ejemplos de uso"
echo ""
