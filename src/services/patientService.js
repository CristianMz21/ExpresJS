const prisma = require("../utils/prismaClient");
const { NotFoundError, ConflictError } = require("../utils/errors/errorHelpers");

/**
 * Servicio para manejar la lógica de negocio de pacientes usando Prisma
 */
class PatientService {
  /**
   * Obtiene todos los pacientes
   * @returns {Promise<Array>} Lista de pacientes
   */
  async getAllPatients() {
    return await prisma.patient.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Obtiene un paciente por ID
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} Paciente encontrado
   * @throws {NotFoundError} Si el paciente no existe
   */
  async getPatientById(id) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
        appointments: {
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true,
              },
            },
          },
          orderBy: {
            dateTime: "desc",
          },
        },
        medicalRecords: {
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true,
              },
            },
          },
          orderBy: {
            visitDate: "desc",
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundError(`Paciente con ID ${id} no encontrado`);
    }

    return patient;
  }

  /**
   * Crea un nuevo paciente con su usuario asociado
   * @param {Object} patientData - Datos del paciente y usuario
   * @returns {Promise<Object>} Paciente creado
   * @throws {ConflictError} Si el email o username ya existe
   */
  async createPatient(patientData) {
    const { email, username, password, firstName, lastName, dateOfBirth, gender, phone, address, bloodType, allergies, medicalHistory, emergencyContact } = patientData;

    // Verificar si el email o username ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError(`El email '${email}' ya está registrado`);
      }
      throw new ConflictError(`El username '${username}' ya está registrado`);
    }

    // Crear usuario y paciente en una transacción
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        address,
        bloodType,
        allergies,
        medicalHistory,
        emergencyContact,
        user: {
          create: {
            email,
            username,
            password, // En producción, debería estar hasheado
            role: "PATIENT",
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return patient;
  }

  /**
   * Actualiza un paciente
   * @param {string} id - ID del paciente
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Paciente actualizado
   * @throws {NotFoundError} Si el paciente no existe
   */
  async updatePatient(id, updates) {
    // Verificar que el paciente existe
    await this.getPatientById(id);

    const patient = await prisma.patient.update({
      where: { id },
      data: updates,
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return patient;
  }

  /**
   * Elimina un paciente
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} Paciente eliminado
   * @throws {NotFoundError} Si el paciente no existe
   */
  async deletePatient(id) {
    // Verificar que el paciente existe
    await this.getPatientById(id);

    const patient = await prisma.patient.delete({
      where: { id },
      include: {
        user: true,
      },
    });

    return patient;
  }

  /**
   * Busca pacientes por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de pacientes encontrados
   */
  async searchPatients(searchTerm) {
    return await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: "insensitive" } },
          { lastName: { contains: searchTerm, mode: "insensitive" } },
          { user: { email: { contains: searchTerm, mode: "insensitive" } } },
          { user: { username: { contains: searchTerm, mode: "insensitive" } } },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }
}

// Exportar instancia singleton
module.exports = new PatientService();
