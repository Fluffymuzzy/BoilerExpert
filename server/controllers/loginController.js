const conn = require("../sqlConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const result = await queryDatabase(login);
    const dbPassword = JSON.parse(JSON.stringify(result[0].password));

    const hashedPassword = await hashPassword(dbPassword);
    await updatePassword(login, hashedPassword);

    const isMatch = await comparePasswords(password, dbPassword);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ login }, process.env.JWT_SECRET);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const queryDatabase = (login) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM admin WHERE login = ?`,
      [login],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

const hashPassword = (password) => {
  return bcrypt.hash(password, 8);
};

const updatePassword = (login, hashedPassword) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE admin SET password = ? WHERE login = ?`,
      [hashedPassword, login],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

const comparePasswords = (password, dbPassword) => {
  return bcrypt.compare(password, dbPassword);
};

module.exports = {
  login,
};
