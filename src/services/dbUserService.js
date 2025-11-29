const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors/errorHelpers");

/**
 * Database User Service
 * Handles all database interactions and business logic for users
 */
class DbUserService {
  constructor() {
    this.SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
    
    // Fields to select when returning user data
    this.USER_SELECT_FIELDS = {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  /**
   * Hashes a password
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Generates JWT token
   * @param {Object} user 
   * @returns {string}
   */
  generateAuthToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en las variables de entorno");
    }

    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRATION }
    );
  }

  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    return await prisma.user.findMany({
      select: this.USER_SELECT_FIELDS,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get user by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   * @throws {NotFoundError}
   */
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: this.USER_SELECT_FIELDS,
    });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return user;
  }

  /**
   * Create new user
   * @param {Object} userData 
   * @returns {Promise<Object>}
   * @throws {ConflictError}
   */
  async createUser(userData) {
    const { email, username, password, role = "USER" } = userData;

    // Check duplicates
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      throw new ConflictError(
        `El ${field} ya está registrado`,
        { field, value: field === "email" ? email : username }
      );
    }

    const hashedPassword = await this.hashPassword(password);

    return await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        password: hashedPassword,
        role,
      },
      select: this.USER_SELECT_FIELDS,
    });
  }

  /**
   * Update user
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   * @throws {ConflictError}
   */
  async updateUser(id, updates) {
    // Check duplicates if updating unique fields
    if (updates.email || updates.username) {
      const duplicateCheck = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                updates.email ? { email: updates.email } : {},
                updates.username ? { username: updates.username } : {},
              ].filter(obj => Object.keys(obj).length > 0)
            }
          ]
        },
      });

      if (duplicateCheck) {
        const field = duplicateCheck.email === updates.email ? "email" : "username";
        throw new ConflictError(`El ${field} ya está en uso por otro usuario`);
      }
    }

    return await prisma.user.update({
      where: { id },
      data: updates,
      select: this.USER_SELECT_FIELDS,
    });
  }

  /**
   * Update password
   * @param {string} id 
   * @param {string} currentPassword 
   * @param {string} newPassword 
   * @throws {NotFoundError|UnauthorizedError}
   */
  async updatePassword(id, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("La contraseña actual es incorrecta");
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Delete user
   * @param {string} id 
   * @throws {NotFoundError}
   */
  async deleteUser(id) {
    // Check existence first
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Authenticate user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} { user, token }
   * @throws {UnauthorizedError}
   */
  async authenticateUser(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = this.generateAuthToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }
}

module.exports = new DbUserService();
