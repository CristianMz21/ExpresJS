const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const idRegex = /^[0-9]+$/;

const validateName = (name) => {
  if (!name || !nameRegex.test(name)) {
    return {
      valid: false,
      error: "Invalid name format. Only letters and spaces allowed.",
    };
  }
  return { valid: true };
};

const validateEmail = (email) => {
  if (!email || !emailRegex.test(email)) {
    return {
      valid: false,
      error: "Invalid email format.",
    };
  }
  return { valid: true };
};

const validateId = (id) => {
  if (!id || !idRegex.test(id)) {
    return {
      valid: false,
      error: "Invalid ID format. Only numbers allowed.",
    };
  }
  return { valid: true };
};

const validateUserData = (name, email) => {
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  return { valid: true };
};

module.exports = {
  validateName,
  validateEmail,
  validateId,
  validateUserData,
};
