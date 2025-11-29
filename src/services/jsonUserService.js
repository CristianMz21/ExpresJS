const { readFile, writeFile } = require("../utils/fs/fileManager");
const { NotFoundError, ConflictError } = require("../utils/errors/errorHelpers");

/**
 * Servicio para manejar la lógica de negocio de usuarios
 * Separa la lógica de datos de los controladores
 */
class UserService {
  constructor() {
    this.dataPath = "src/data/user.json";
  }

  /**
   * Carga todos los usuarios desde el archivo JSON
   * @returns {Promise<Array>} Lista de usuarios
   */
  async loadUsers() {
    const data = await readFile(this.dataPath);
    if (!data) {
      throw new Error("Error al leer los datos de usuarios");
    }
    return JSON.parse(data);
  }

  /**
   * Guarda los usuarios en el archivo JSON
   * @param {Array} users - Lista de usuarios a guardar
   */
  async saveUsers(users) {
    await writeFile(this.dataPath, JSON.stringify(users, null, 2));
  }

  /**
   * Busca un usuario por ID
   * @param {Array} users - Lista de usuarios
   * @param {string|number} id - ID del usuario
   * @returns {number} Índice del usuario o -1 si no existe
   */
  findUserIndex(users, id) {
    return users.findIndex((u) => u.id === parseInt(id, 10));
  }

  /**
   * Obtiene un usuario por ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   * @throws {NotFoundError} Si el usuario no existe
   */
  async getUserById(id) {
    const users = await this.loadUsers();
    const userIndex = this.findUserIndex(users, id);

    if (userIndex === -1) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    return users[userIndex];
  }

  /**
   * Verifica si un email ya existe
   * @param {Array} users - Lista de usuarios
   * @param {string} email - Email a verificar
   * @param {number|null} excludeId - ID a excluir de la búsqueda
   * @returns {boolean} True si el email existe
   */
  emailExists(users, email, excludeId = null) {
    return users.some(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId
    );
  }

  /**
   * Genera el siguiente ID disponible
   * @param {Array} users - Lista de usuarios
   * @returns {number} Siguiente ID
   */
  generateNextId(users) {
    return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    return await this.loadUsers();
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   * @throws {ConflictError} Si el email ya existe
   */
  async createUser(userData) {
    const { name, email } = userData;
    const users = await this.loadUsers();

    // Verificar email duplicado
    if (this.emailExists(users, email)) {
      throw new ConflictError(
        `El email '${email}' ya está registrado en el sistema`
      );
    }

    // Crear usuario
    const newUser = {
      id: this.generateNextId(users),
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await this.saveUsers(users);

    return newUser;
  }

  /**
   * Reemplaza completamente un usuario (PUT)
   * @param {string|number} id - ID del usuario
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Promise<Object>} Usuario actualizado
   * @throws {NotFoundError} Si el usuario no existe
   * @throws {ConflictError} Si el email ya existe
   */
  async replaceUser(id, userData) {
    const { name, email } = userData;
    const users = await this.loadUsers();
    const userIndex = this.findUserIndex(users, id);

    if (userIndex === -1) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar email duplicado (excluyendo el usuario actual)
    if (this.emailExists(users, email, parseInt(id, 10))) {
      throw new ConflictError(
        `El email '${email}' ya está registrado por otro usuario`
      );
    }

    // Reemplazar usuario
    const updatedUser = {
      id: parseInt(id, 10),
      name: name.trim(),
      email: email.trim(),
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    await this.saveUsers(users);

    return updatedUser;
  }

  /**
   * Actualiza parcialmente un usuario (PATCH)
   * @param {string|number} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   * @throws {NotFoundError} Si el usuario no existe
   * @throws {ConflictError} Si el email ya existe
   */
  async updateUser(id, updates) {
    const users = await this.loadUsers();
    const userIndex = this.findUserIndex(users, id);

    if (userIndex === -1) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar email duplicado si se está actualizando
    if (updates.email && this.emailExists(users, updates.email, parseInt(id, 10))) {
      throw new ConflictError(
        `El email '${updates.email}' ya está registrado por otro usuario`
      );
    }

    // Actualizar usuario
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    await this.saveUsers(users);

    return updatedUser;
  }

  /**
   * Elimina un usuario
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Usuario eliminado
   * @throws {NotFoundError} Si el usuario no existe
   */
  async deleteUser(id) {
    const users = await this.loadUsers();
    const userIndex = this.findUserIndex(users, id);

    if (userIndex === -1) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    await this.saveUsers(users);

    return deletedUser;
  }
}

// Exportar instancia singleton
module.exports = new UserService();
