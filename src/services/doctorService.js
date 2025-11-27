const prisma = require("../utils/prismaClient");
const { NotFoundError, ConflictError } = require("../utils/errorHelpers");

/**
 * Servicio para manejar la lógica de negocio de doctores usando Prisma
 */
class DoctorService {
  /**
   * Obtiene todos los doctores
   * @returns {Promise<Array>} Lista de doctores
   */
  async getAllDoctors() {
    return await prisma.doctor.findMany({
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
        lastName: "asc",
      },
    });
  }

  /**
   * Obtiene un doctor por ID
   * @param {string} id - ID del doctor
   * @returns {Promise<Object>} Doctor encontrado
   * @throws {NotFoundError} Si el doctor no existe
   */
  async getDoctorById(id) {
    const doctor = await prisma.doctor.findUnique({
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
            patient: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
          orderBy: {
            dateTime: "desc",
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundError(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }

  /**
   * Crea un nuevo doctor con su usuario asociado
   * @param {Object} doctorData - Datos del doctor y usuario
   * @returns {Promise<Object>} Doctor creado
   * @throws {ConflictError} Si el email, username o licenseNumber ya existe
   */
  async createDoctor(doctorData) {
    const { email, username, password, firstName, lastName, specialization, licenseNumber, phone, yearsOfExperience } = doctorData;

    // Verificar si el email, username o licenseNumber ya existe
    const [existingUser, existingDoctor] = await Promise.all([
      prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      }),
      prisma.doctor.findFirst({
        where: {
          OR: [{ licenseNumber }, { email }],
        },
      }),
    ]);

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError(`El email '${email}' ya está registrado`);
      }
      throw new ConflictError(`El username '${username}' ya está registrado`);
    }

    if (existingDoctor) {
      if (existingDoctor.licenseNumber === licenseNumber) {
        throw new ConflictError(`El número de licencia '${licenseNumber}' ya está registrado`);
      }
      throw new ConflictError(`El email del doctor '${email}' ya está registrado`);
    }

    // Crear usuario y doctor en una transacción
    const doctor = await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        specialization,
        licenseNumber,
        phone,
        email,
        yearsOfExperience,
        user: {
          create: {
            email,
            username,
            password, // En producción, debería estar hasheado
            role: "DOCTOR",
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

    return doctor;
  }

  /**
   * Actualiza un doctor
   * @param {string} id - ID del doctor
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Doctor actualizado
   * @throws {NotFoundError} Si el doctor no existe
   */
  async updateDoctor(id, updates) {
    // Verificar que el doctor existe
    await this.getDoctorById(id);

    const doctor = await prisma.doctor.update({
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

    return doctor;
  }

  /**
   * Elimina un doctor
   * @param {string} id - ID del doctor
   * @returns {Promise<Object>} Doctor eliminado
   * @throws {NotFoundError} Si el doctor no existe
   */
  async deleteDoctor(id) {
    // Verificar que el doctor existe
    await this.getDoctorById(id);

    const doctor = await prisma.doctor.delete({
      where: { id },
      include: {
        user: true,
      },
    });

    return doctor;
  }

  /**
   * Busca doctores por especialización
   * @param {string} specialization - Especialización a buscar
   * @returns {Promise<Array>} Lista de doctores encontrados
   */
  async getDoctorsBySpecialization(specialization) {
    return await prisma.doctor.findMany({
      where: {
        specialization: { contains: specialization, mode: "insensitive" },
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

  /**
   * Busca doctores por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de doctores encontrados
   */
  async searchDoctors(searchTerm) {
    return await prisma.doctor.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: "insensitive" } },
          { lastName: { contains: searchTerm, mode: "insensitive" } },
          { specialization: { contains: searchTerm, mode: "insensitive" } },
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
module.exports = new DoctorService();
