module.exports = (router) => {
  require("./v1/usersRoute")(router);
  require("./v1/notesRoute")(router);
};
