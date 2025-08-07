const { get, upsert, remove } = require("../../controllers/notesController");
const authorization = require("../../../middleware/jwt");

module.exports = (router) => {
  router.get("/notes", authorization, get);
  router.post("/notes", authorization, upsert);
  router.delete("/notes/:id", authorization, remove);
};
