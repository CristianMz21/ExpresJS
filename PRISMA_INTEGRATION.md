# Prisma Integration Guide

## 🎉 What's Been Created

### Core Infrastructure

#### 1. [prismaClient.js](file:///wsl.localhost/Ubuntu-24.04/home/mackroph/Platzi/Expres/src/utils/prismaClient.js)

Singleton Prisma client with:

- Connection pooling
- Development hot-reload support
- Graceful shutdown handling
- Query logging in development

### Services Created (Prisma-based)

#### 2. [patientService.js](file:///wsl.localhost/Ubuntu-24.04/home/mackroph/Platzi/Expres/src/services/patientService.js)

Full patient management:

- ✅ CRUD operations
- ✅ User relationship handling
- ✅ Search functionality
- ✅ Appointments & medical records inclusion

#### 3. [doctorService.js](file:///wsl.localhost/Ubuntu-24.04/home/mackroph/Platzi/Expres/src/services/doctorService.js)

Complete doctor management:

- ✅ CRUD operations
- ✅ Specialization search
- ✅ License validation
- ✅ Appointments tracking

#### 4. [appointmentService.js](file:///wsl.localhost/Ubuntu-24.04/home/mackroph/Platzi/Expres/src/services/appointmentService.js)

Appointment scheduling:

- ✅ Create/update/cancel appointments
- ✅ **Conflict detection**
- ✅ Filter by patient/doctor/date
- ✅ Status management

## 🚀 Next Steps

### 1. Run Setup Commands

In your WSL terminal:

```bash
cd /home/mackroph/Platzi/Expres

# Generate Prisma client
yarn db:generate

# Push schema to database
yarn db:push

# Test connection
yarn db:test
```

### 2. Create Controllers

Example patient controller:

```javascript
const patientService = require("../services/patientService");

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getAllPatients();
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

exports.createPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};
```

### 3. Add Routes

```javascript
const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.get("/patients", patientController.getAllPatients);
router.post("/patients", patientController.createPatient);
router.get("/patients/:id", patientController.getPatientById);
router.patch("/patients/:id", patientController.updatePatient);
router.delete("/patients/:id", patientController.deletePatient);

module.exports = router;
```

## 📊 Service Features

### Patient Service

```javascript
const patientService = require("./services/patientService");

// Get all patients with user data
await patientService.getAllPatients();

// Get patient with appointments and medical records
await patientService.getPatientById(id);

// Create patient with user account
await patientService.createPatient({
  email,
  username,
  password,
  firstName,
  lastName,
  dateOfBirth,
  gender,
  phone,
  // ... other fields
});

// Search patients
await patientService.searchPatients("John");
```

### Doctor Service

```javascript
const doctorService = require("./services/doctorService");

// Get doctors by specialization
await doctorService.getDoctorsBySpecialization("Cardiología");

// Create doctor with user account
await doctorService.createDoctor({
  email,
  username,
  password,
  firstName,
  lastName,
  specialization,
  licenseNumber,
  // ... other fields
});
```

### Appointment Service

```javascript
const appointmentService = require("./services/appointmentService");

// Create appointment with conflict detection
await appointmentService.createAppointment({
  patientId,
  doctorId,
  dateTime,
  duration,
  reason,
});

// Get appointments by doctor
await appointmentService.getAppointmentsByDoctor(doctorId);

// Get appointments by date
await appointmentService.getAppointmentsByDate(new Date());

// Cancel appointment
await appointmentService.cancelAppointment(id);
```

## 🔧 Error Handling

All services use the existing error helpers:

- `NotFoundError` - Resource not found (404)
- `ConflictError` - Duplicate data (409)

These integrate with your existing error middleware!

## 🛠️ Development Tools

```bash
# Open Prisma Studio (database GUI)
yarn db:studio

# View query logs
# Already enabled in development mode
```

## ⚠️ Important Notes

1. **Password hashing**: Services currently accept plain passwords. Add bcrypt hashing before production
2. **Validation**: Add request validation middleware (e.g., express-validator)
3. **Authentication**: Implement JWT or session-based auth
4. **Permissions**: Add role-based access control

## 🎯 Migration from JSON

Your existing `userService.js` uses JSON files. The new Prisma services replace this pattern with database operations. You can:

- Keep both during transition
- Gradually migrate to Prisma
- Use Prisma for new features
