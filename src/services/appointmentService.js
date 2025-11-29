const prisma = require("../utils/prismaClient");
const { NotFoundError, ConflictError } = require("../utils/errors/errorHelpers");

/**
 * Servicio para manejar la lógica de negocio de citas usando Prisma
 */
class AppointmentService {
  /**
   * Obtiene todas las citas
   * @returns {Promise<Array>} Lista de citas
   */
  async getAllAppointments() {
    return await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
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
    });
  }

  /**
   * Obtiene una cita por ID
   * @param {string} id - ID de la cita
   * @returns {Promise<Object>} Cita encontrada
   * @throws {NotFoundError} Si la cita no existe
   */
  async getAppointmentById(id) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                email: true,
                username: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundError(`Cita con ID ${id} no encontrada`);
    }

    return appointment;
  }

  /**
   * Crea una nueva cita
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Object>} Cita creada
   * @throws {NotFoundError} Si el paciente o doctor no existe
   * @throws {ConflictError} Si hay conflicto de horario
   */
  async createAppointment(appointmentData) {
    const { patientId, doctorId, dateTime, duration = 30, reason, notes } = appointmentData;

    // Verificar que el paciente y doctor existen
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId } }),
    ]);

    if (!patient) {
      throw new NotFoundError(`Paciente con ID ${patientId} no encontrado`);
    }

    if (!doctor) {
      throw new NotFoundError(`Doctor con ID ${doctorId} no encontrado`);
    }

    // Verificar conflictos de horario para el doctor
    const appointmentDateTime = new Date(dateTime);
    const endTime = new Date(appointmentDateTime.getTime() + duration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
        AND: [
          { dateTime: { lt: endTime } },
          {
            dateTime: {
              gte: new Date(appointmentDateTime.getTime() - duration * 60000),
            },
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new ConflictError(
        `El doctor ya tiene una cita programada en ese horario`
      );
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: appointmentDateTime,
        duration,
        reason,
        notes,
        status: "SCHEDULED",
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return appointment;
  }

  /**
   * Actualiza una cita
   * @param {string} id - ID de la cita
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Cita actualizada
   * @throws {NotFoundError} Si la cita no existe
   */
  async updateAppointment(id, updates) {
    // Verificar que la cita existe
    await this.getAppointmentById(id);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updates,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return appointment;
  }

  /**
   * Cancela una cita
   * @param {string} id - ID de la cita
   * @returns {Promise<Object>} Cita cancelada
   * @throws {NotFoundError} Si la cita no existe
   */
  async cancelAppointment(id) {
    return await this.updateAppointment(id, { status: "CANCELLED" });
  }

  /**
   * Obtiene citas por paciente
   * @param {string} patientId - ID del paciente
   * @returns {Promise<Array>} Lista de citas del paciente
   */
  async getAppointmentsByPatient(patientId) {
    return await prisma.appointment.findMany({
      where: { patientId },
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
    });
  }

  /**
   * Obtiene citas por doctor
   * @param {string} doctorId - ID del doctor
   * @returns {Promise<Array>} Lista de citas del doctor
   */
  async getAppointmentsByDoctor(doctorId) {
    return await prisma.appointment.findMany({
      where: { doctorId },
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
        dateTime: "asc",
      },
    });
  }

  /**
   * Obtiene citas por fecha
   * @param {Date} date - Fecha a buscar
   * @returns {Promise<Array>} Lista de citas en esa fecha
   */
  async getAppointmentsByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });
  }
}

// Exportar instancia singleton
module.exports = new AppointmentService();
