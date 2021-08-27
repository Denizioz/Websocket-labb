const path = require("path");

const express = require("express");
const app = express();

const http = require("http");
const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer);

app.use(express.static(path.join(__dirname, "/public")));

//const response = await axios.get(
//  "https://opentdb.com/api.php?amount=1&type=multiple"
//);
let player = 0;

const addPlayer = (arg) => {
  if ((this.player = 0)) {
    arg.join("player");
    player++;
  } else {
    arg.join("spectator");
  }
};

io.on("connection", (socket) => {
  addPlayer(socket);
  io.to("player").emit(console.log("Hej"));
  io.on("disconnecting", () => {
    console.log("Player disconnected from " + socket.room);
  });
  console.log(this.player);
  console.log(`A client with id ${socket.id} connected`);
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected.`);
  });
});
httpServer.listen(3000);
