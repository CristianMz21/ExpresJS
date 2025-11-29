# 🗄️ Prisma Configuration - Hospital Database

## ✅ Configuración Completada

Tu schema de Prisma ha sido configurado con:

### 🔗 Conexión a la Base de Datos

- **Provider**: PostgreSQL
- **Database URL**: Configurada desde la variable de entorno `DATABASE_URL`
- **Database Name**: `Hospital`

### 📊 Modelos Creados

El schema incluye 5 modelos principales para un sistema hospitalario:

#### 1. **User** (Usuarios del sistema)

- Autenticación y autorización
- Roles: ADMIN, DOCTOR, PATIENT, USER
- Relación uno-a-uno con Doctor o Patient

#### 2. **Patient** (Pacientes)

- Información personal y médica
- Historial médico, alergias, tipo de sangre
- Contacto de emergencia
- Relaciones: citas y registros médicos

#### 3. **Doctor** (Doctores)

- Información profesional
- Especialización y licencia médica
- Años de experiencia
- Relaciones: citas y registros médicos

#### 4. **Appointment** (Citas)

- Programación de citas entre pacientes y doctores
- Estados: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
- Duración configurable (default: 30 minutos)

#### 5. **MedicalRecord** (Registros Médicos)

- Diagnósticos y tratamientos
- Prescripciones médicas
- Notas del doctor

### 📋 Enums Definidos

- **UserRole**: ADMIN, DOCTOR, PATIENT, USER
- **Gender**: MALE, FEMALE, OTHER
- **AppointmentStatus**: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

---

## 🚀 Próximos Pasos

### 1. Verificar la DATABASE_URL

Asegúrate de que tu `.env` tenga la URL correcta. Deberías tener:

```env
# Para desarrollo local (fuera de Docker)
DATABASE_URL=postgres://postgres:POSTGRES_25112025_DEV@localhost:5432/Hospital

# Para desarrollo dentro de Docker (descomentar cuando uses Docker)
# DATABASE_URL=postgres://postgres:POSTGRES_25112025_DEV@db:5432/Hospital
```

### 2. Generar el Cliente de Prisma

```bash
npx prisma generate
```

Esto creará el cliente de Prisma en `src/generated/prisma/`.

### 3. Crear las Migraciones

```bash
# Crear la primera migración
npx prisma migrate dev --name init

# O si prefieres solo sincronizar el schema sin migraciones
npx prisma db push
```

### 4. Abrir Prisma Studio (Opcional)

```bash
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` para ver y editar tus datos.

---

## 📝 Uso en tu Aplicación Express

### Inicializar el Cliente de Prisma

Crea un archivo `src/config/database.js`:

```javascript
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Manejar cierre graceful
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

### Ejemplo de Uso en Controladores

```javascript
const prisma = require("../config/database");

// Crear un paciente
async function createPatient(req, res) {
  try {
    const patient = await prisma.patient.create({
      data: {
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: new Date(req.body.dateOfBirth),
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener todas las citas de un paciente
async function getPatientAppointments(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: req.params.patientId,
      },
      include: {
        doctor: true,
        patient: true,
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 🔧 Comandos Útiles de Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_de_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Sincronizar schema sin migraciones (desarrollo)
npx prisma db push

# Resetear base de datos (⚠️ BORRA TODOS LOS DATOS)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Validar schema
npx prisma validate

# Formatear schema
npx prisma format

# Ver estado de migraciones
npx prisma migrate status
```

---

## 🔍 Verificar Conexión

Para verificar que Prisma puede conectarse a tu base de datos:

```bash
npx prisma db pull
```

Este comando intentará leer el schema de tu base de datos.

---

## 📚 Recursos Adicionales

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma with Express.js](https://www.prisma.io/express)

---

## ⚠️ Notas Importantes

1. **Migraciones**: Usa `migrate dev` en desarrollo y `migrate deploy` en producción
2. **Cliente Prisma**: Se genera en `src/generated/prisma/` según tu configuración
3. **Tipos TypeScript**: Si usas TypeScript, Prisma genera tipos automáticamente
4. **Performance**: Usa `include` y `select` para optimizar queries
5. **Transacciones**: Usa `prisma.$transaction()` para operaciones atómicas
