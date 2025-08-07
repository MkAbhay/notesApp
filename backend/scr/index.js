const router = require("express").Router();

module.exports = (app) => {
  require("./routes")(router);

  app.use("/api/v1", router);

  app.use("/api/v1/healt", (req, res) => {
    res
      .status(200)
      .json({ status: true, message: "Server is running healthy" });
  });

  app.use((req, res) => {
    res.status(404).json({ status: false, message: "Not found" });
  });
};
