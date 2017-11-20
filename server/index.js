const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const serverPort = 5000;

const TicTacToe = new (require("./TicTacToe"))(io);

// Initialize tictactoe
TicTacToe.init();

// app.get("/", function(req, res) {
//   res.send("<h1>Hello world</h1>");
// });

http.listen(serverPort, function() {
  console.log(new Date(), ` Listening on ${serverPort}`);
});
