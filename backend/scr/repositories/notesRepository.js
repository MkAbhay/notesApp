const { query } = require("../../database");
const { NOTES } = require("../../constant");

const get = async (user_id, tags) => {
  let text = `SELECT * FROM ${NOTES} WHERE user_id = $1 AND is_deleted = false`;
  const values = [user_id];
  let paramIndex = 2;
  if (tags && tags.length > 0) {
    text += ` AND tags && $${paramIndex}`;
    values.push(tags);
    paramIndex++;
  }
  text += ` ORDER BY updated_at DESC`;
  const result = await query(text, values);
  return { data: result.rows, count: result.rowCount };
};

const create = async (title, content, tags, user_id) => {
  let text = `INSERT INTO ${NOTES} (title, content, tags, user_id) 
  VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await query(text, [title, content, tags, user_id]);
  return { data: result.rows[0], count: result.rowCount };
};

const update = async (id, title, content, tags) => {
  let text = `UPDATE ${NOTES} SET title = $1, content = $2, tags = $3, updated_at = NOW()
  WHERE id = $4 RETURNING *`;
  ``;
  const result = await query(text, [title, content, tags, id]);
  return { data: result.rows[0], count: result.rowCount };
};

const remove = async (params) => {
  let text = `UPDATE ${NOTES} SET is_deleted = true WHERE id = $1`;
  const result = await query(text, [params.id]);
  return { data: result.rows[0], count: result.rowCount };
};

module.exports = {
  get,
  create,
  update,
  remove,
};
