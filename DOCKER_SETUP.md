# Docker Setup - Express + PostgreSQL

Este documento explica la configuración mejorada de Docker para tu aplicación Express.js con PostgreSQL.

## 🚀 Mejoras Implementadas

### Docker Compose

1. **Imagen Alpine de PostgreSQL**: Más ligera y eficiente
2. **Redes Docker**: Comunicación segura entre servicios mediante `app-network`
3. **Límites de Recursos**: Control de CPU y memoria para evitar sobrecarga
4. **pgAdmin**: Interfaz web para administrar PostgreSQL fácilmente
5. **Health Checks Mejorados**: Incluye `start_period` para dar tiempo de inicialización
6. **Volumen de Backups**: Directorio `./backups` montado para respaldos
7. **Variables con Valores por Defecto**: Uso de `${VAR:-default}` para flexibilidad
8. **Servicio Express Preparado**: Listo para descomentar cuando tengas el Dockerfile

### Variables de Entorno

El archivo `.env.example` incluye:

- ✅ **Organización por secciones** para mejor legibilidad
- ✅ **Comentarios descriptivos** en cada variable
- ✅ **Variables adicionales** para pgAdmin y networking
- ✅ **DATABASE_URL** preconfigurada para ORMs
- ✅ **Secciones preparadas** para JWT, CORS, logging, etc.

## 📋 Uso

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

**⚠️ IMPORTANTE**: Cambia las contraseñas en producción:

- `POSTGRES_PASSWORD`
- `PGADMIN_PASSWORD`

### 2. Iniciar los Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f db
docker-compose logs -f pgadmin
```

### 3. Acceder a pgAdmin

1. Abre tu navegador en `http://localhost:5050`
2. Inicia sesión con:
   - **Email**: `admin@admin.com` (o el que configuraste)
   - **Password**: `admin` (o el que configuraste)
3. Agrega un nuevo servidor:
   - **Host**: `db` (nombre del servicio en Docker)
   - **Port**: `5432`
   - **Username**: Tu `POSTGRES_USER`
   - **Password**: Tu `POSTGRES_PASSWORD`

### 4. Conectar desde tu Aplicación Express

#### Desde fuera de Docker (desarrollo local):

```javascript
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
```

#### Desde dentro de Docker:

```javascript
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`;
```

O simplemente usa:

```javascript
const connectionString = process.env.DATABASE_URL;
```

## 🔧 Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA TODOS LOS DATOS)
docker-compose down -v

# Reconstruir servicios
docker-compose up -d --build

# Ver estado de servicios
docker-compose ps

# Ejecutar comandos en PostgreSQL
docker-compose exec db psql -U postgres -d miapp_db

# Crear backup de la base de datos
docker-compose exec db pg_dump -U postgres miapp_db > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -T db psql -U postgres -d miapp_db < ./backups/tu_backup.sql
```

## 📁 Estructura de Directorios

```
.
├── docker-compose.yml
├── .env
├── .env.example
├── initdb/              # Scripts SQL que se ejecutan al crear la BD
│   └── 01-init.sql     # (opcional) Script de inicialización
├── backups/            # Directorio para backups de la BD
└── src/                # Tu código de Express
```

## 🐳 Dockerizar tu Aplicación Express (Próximo Paso)

Cuando estés listo, crea un `Dockerfile` en la raíz del proyecto:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Luego descomenta la sección `app` en `docker-compose.yml`.

## 🔒 Seguridad

- ✅ El archivo `.env` está en `.gitignore` (no se sube a Git)
- ✅ Usa `.env.example` como plantilla sin datos sensibles
- ⚠️ **NUNCA** subas contraseñas reales a Git
- ⚠️ En producción, usa secretos de Docker o variables de entorno del sistema

## 🆘 Troubleshooting

### El contenedor de PostgreSQL no inicia

```bash
# Ver logs detallados
docker-compose logs db

# Verificar que el puerto 5432 no esté en uso
netstat -an | grep 5432
```

### No puedo conectarme a la base de datos

```bash
# Verificar que el servicio esté saludable
docker-compose ps

# Probar conexión manualmente
docker-compose exec db psql -U postgres -d miapp_db
```

### Resetear completamente la base de datos

```bash
docker-compose down -v
docker-compose up -d
```

## 📚 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
