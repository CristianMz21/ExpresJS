const { readFile, writeFile } = require("../utils/managerFiles");
const {
  validateUserData,
  validateId,
  validateName,
  validateEmail,
} = require("../utils/validators");

// Helper Functions
const loadUsers = async () => {
  const data = await readFile("src/data/user.json");
  if (!data) {
    throw new Error("Error reading user data");
  }
  return JSON.parse(data);
};

const saveUsers = async (users) => {
  await writeFile("src/data/user.json", JSON.stringify(users, null, 2));
};

const findUserById = (users, id) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(id, 10));
  return userIndex;
};

// Get Users
const getUsers = async (req, res) => {
  try {
    const data = await readFile("src/data/user.json");
    if (!data) {
      return res.status(500).send("Error reading user data");
    }
    res.type("application/json").send(data);
  } catch (error) {
    res.status(500).send("Error reading user data");
  }
};

// Create User
const createUser = async (req, res) => {
  const { name, email } = req.body;

  const validation = validateUserData(name, email);
  if (!validation.valid) {
    return res.status(400).send(validation.error);
  }

  const newUser = { name: name.trim(), email: email.trim() };

  try {
    const users = await loadUsers();
    const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userWithId = { id, ...newUser };
    users.push(userWithId);

    await saveUsers(users);

    res
      .status(201)
      .json({ message: "User added successfully", user: userWithId });
  } catch (error) {
    res.status(500).send("Error processing user data");
  }
};

// Put User (Full Replacement)
const putUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const idValidation = validateId(id);
  if (!idValidation.valid) {
    return res.status(400).send(idValidation.error);
  }

  const dataValidation = validateUserData(name, email);
  if (!dataValidation.valid) {
    return res.status(400).send(dataValidation.error);
  }

  const newUser = { name: name.trim(), email: email.trim() };

  try {
    const users = await loadUsers();
    const userIndex = findUserById(users, id);

    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    users[userIndex] = { id: parseInt(id, 10), ...newUser };
    await saveUsers(users);

    res
      .status(200)
      .json({ message: "User replaced successfully", user: users[userIndex] });
  } catch (error) {
    res.status(500).send("Error processing user data");
  }
};

// Patch User (Partial Update)
const patchUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const idValidation = validateId(id);
  if (!idValidation.valid) {
    return res.status(400).send(idValidation.error);
  }

  if (!name && !email) {
    return res
      .status(400)
      .send("At least one field (name or email) is required.");
  }

  try {
    const users = await loadUsers();
    const userIndex = findUserById(users, id);

    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    // Validate and update only provided fields
    const updates = {};
    if (name !== undefined) {
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        return res.status(400).send(nameValidation.error);
      }
      updates.name = name.trim();
    }
    if (email !== undefined) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).send(emailValidation.error);
      }
      updates.email = email.trim();
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    await saveUsers(users);

    res
      .status(200)
      .json({ message: "User updated successfully", user: users[userIndex] });
  } catch (error) {
    res.status(500).send("Error processing user data");
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const idValidation = validateId(id);
  if (!idValidation.valid) {
    return res.status(400).send(idValidation.error);
  }

  try {
    const users = await loadUsers();
    const userIndex = findUserById(users, id);

    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    users.splice(userIndex, 1);
    await saveUsers(users);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send("Error processing user data");
  }
};

module.exports = {
  getUsers,
  createUser,
  putUser,
  patchUser,
  deleteUser,
};
