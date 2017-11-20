import React, { Component } from "react";
import io from "socket.io-client";
import classNames from "classnames";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    board: new Array(9).fill("N"),
    turn: false,
    mark: null,
    data: []
  };
  componentWillMount() {
    this.socket = io("http://localhost:5000");
    this.socket.on("connect", () => {
      console.log("Socket connected");
    });
  }

  componentDidMount() {
    this.socket.on("gameStart", ({ turn, mark }) => {
      console.log(" gameStart ", turn, mark);
      this.setState({ turn, mark });
    });

    // Opponent Move
    this.socket.on("opponentPlay", cellIndex => {
      console.log("Opponent Clicked ", cellIndex);
      this.setState(prevState => {
        prevState.board[cellIndex] = this.state.mark === "O" ? "X" : "O";
        return { board: prevState.board, turn: !prevState.turn };
      });
    });

    // opponent
    this.socket.on("opponentDisconnect", () => {
      // Restart
      this.setState({
        board: new Array(9).fill("N")
      });
    });
  }

  isGameOver() {
    let rowCount = 0;
    let colCount = 0;
    for (let i = 0; i < this.state.board.length; i += 1) {
      if (i % 3 === 0) {
        rowCount = 0;
        colCount = 0;
      }
      if (this.state.board[i] === this.state.mark) {
        rowCount += 1;
      }
      const complementIndex = (i % 3) * 3 + Math.floor(i / 3);
      if (this.state.board[complementIndex] === this.state.mark) {
        colCount += 1;
      }
      if (colCount === 3 || rowCount === 3) {
        return true;
      }

      // Right -> down
      if (
        i === 0 &&
        this.state.board[i] === this.state.board[i + 4] &&
        this.state.board[i] === this.state.board[i + 8] &&
        this.state.board[i] === this.state.mark
      ) {
        return true;
      }

      // Left -> down
      if (
        i === 2 &&
        this.state.board[i] === this.state.mark &&
        this.state.board[i] === this.state.board[i + 2] &&
        this.state.board[i] === this.state.board[i + 4]
      ) {
        return true;
      }
    }

    console.log("Game is not over");
    return false;
  }

  onClickCell = cellIndex => {
    if (this.state.turn && this.state.board[cellIndex] === "N") {
      console.log("Clicked Cell ", cellIndex);
      this.setState(
        prevState => {
          prevState.board[cellIndex] = this.state.mark;
          return { board: prevState.board, turn: !prevState.turn };
        },
        () => {
          if (this.isGameOver()) {
            alert("You won");
            this.socket.emit("gameOver");
          }
        }
      );
      this.socket.emit("cellUpdate", cellIndex);
    }
  };

  renderBoard() {
    const rows = [];
    let currentRow = [];
    for (let i = 0; i < this.state.board.length; i++) {
      if (currentRow.length === 3) {
        rows.push(
          <div key={i / 3} className="row">
            {currentRow}
          </div>
        );
        currentRow = [];
      }
      const cell = (
        <div
          key={i}
          onClick={() => {
            this.onClickCell(i);
          }}
          className={classNames(
            "cell",
            this.state.board[i] === "N" ? "clickable" : ""
          )}
        >
          {this.state.board[i]}
        </div>
      );
      currentRow.push(cell);
    }
    rows.push(
      <div key={3} className="row">
        {currentRow}
      </div>
    );
    return rows;
  }

  render() {
    return (
      <div className={classNames("board", this.state.turn ? "" : "inactive")}>
        {this.renderBoard()}
      </div>
    );
  }
}

export default App;
