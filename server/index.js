const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

this.sockets = {};
this.io = io;

// const sendToNamespace = (nameSpace, callback) => {};

io.on("connection", socket => {
  console.log("SocketId = ", socket.id, " Connected ");

  this.io.clients((error, clients) => {
    if (error) throw error;
    if (clients.length === 2) {
      clients.forEach((clientId, index) => {
        console.log("GameStart ", clientId, " yourTurn ? ", index === 0);
        const info = { turn: index === 0, mark: index === 0 ? "O" : "X" };
        this.io.sockets.connected[clientId].emit("gameStart", info);
      });
    }
    console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
  });

  socket.on("disconnect", reason => {
    console.log("Socket ", socket.id, " disconnected");
    this.io.emit("opponentDisconnect");
    // console.log(this.io.of("/game").sockets);
  });

  socket.on("cellUpdate", cellIndex => {
    console.log("User ", socket.id, " clicked ", cellIndex);
    socket.broadcast.emit("opponentPlay", cellIndex);
  });

  socket.on("gameOver", () => {
    console.log("Winner is ", socket.id);
    // this.
  });
});

// app.get("/", function(req, res) {
//   res.send("<h1>Hello world</h1>");
// });
const port = 5000;
http.listen(5000, function() {
  console.log("listening on *:5000");
});
