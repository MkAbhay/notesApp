const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// HTTP server
const server = http.createServer(app);
// webScoket
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("note:join", (noteId) => {
    socket.join(noteId);
  });

  socket.on("note:update", ({ noteId, data }) => {
    socket.to(noteId).emit("note:updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// middleware
require("./middleware")(app);

require("./scr")(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = {
  app,
};
