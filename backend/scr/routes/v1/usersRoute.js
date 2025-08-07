const { login, register } = require("../../controllers/usersController");

module.exports = (router) => {
  router.post("/register", register);
  router.post("/login", login);
};
