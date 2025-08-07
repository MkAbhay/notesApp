const { query } = require("../../database");
const { USERS } = require("../../constant");

const login = async (email) => {
  let text = `SELECT * FROM ${USERS} WHERE email = $1`;
  const result = await query(text, [email]);
  return { data: result.rows[0], count: result.rowCount };
};

const register = async (email, hash) => {
  let text = `INSERT INTO ${USERS} (email, password) VALUES ($1, $2) RETURNING *`;
  const result = await query(text, [email, hash]);
  return { data: result.rows[0], count: result.rowCount };
};

module.exports = {
  login,
  register,
};
