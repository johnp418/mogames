class TicTacToe {
  constructor(io) {
    this.io = io;
    this.namespace = null;
  }
  init() {
    console.log(new Date(), "Initializing TicTacToe");
    this.namespace = this.io.of("/tictactoe");
    this.namespace.on("connection", socket => {
      console.log("SocketId = ", socket.id, " Connected ");

      this.startGame();

      socket.on("disconnect", reason => {
        console.log("Socket ", socket.id, " disconnected");
        socket.broadcast.emit("opponentDisconnect");
      });

      socket.on("cellUpdate", cellIndex => {
        console.log("User ", socket.id, " clicked ", cellIndex);
        socket.broadcast.emit("opponentPlay", cellIndex);
      });

      socket.on("gameOver", () => {
        console.log("Winner is ", socket.id);
        this.startGame();
      });
    });
  }

  startGame() {
    this.namespace.clients((error, clients) => {
      if (error) throw error;
      if (clients.length === 2) {
        clients.forEach((clientId, index) => {
          console.log("GameStart ", clientId, " yourTurn ? ", index === 0);
          const info = { turn: index === 0, mark: index === 0 ? "O" : "X" };
          this.namespace.connected[clientId].emit("gameStart", info);
        });
      }
      console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
    });
  }
}

module.exports = TicTacToe;
