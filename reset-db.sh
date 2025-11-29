#!/bin/bash

# Database Reset Script
# This script drops and recreates the database from the Prisma schema

echo "🔄 Resetting database..."

# Drop and recreate database (using Prisma)
echo "📦 Pushing Prisma schema to database..."
yarn db:push --force-reset --accept-data-loss

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
yarn db:generate

echo "✅ Database reset complete!"
echo ""
echo "Now run: yarn test"
