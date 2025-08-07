require("dotenv").config();
const { pool } = require("./database");

pool.connect((err, client, release) => {
  if (err) {
    console.error(`Database connection fails | `, err.message);
  }
  console.log("Database connection successful");
  release();
});

require("./server");
