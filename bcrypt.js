const bcrypt = require("bcrypt");
const saltRounds = 10;

async function generateSalt() {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function hashPassword(salt, password) {
  try {
    const hashed_password = await bcrypt.hash(password, salt);
    return hashed_password;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { generateSalt, hashPassword };
