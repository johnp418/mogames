import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import TicTacToe from "./Games/TicTacToe";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="game__list">
            <Link to="tictactoe">Tic Tac Toe</Link>
          </div>
          <div className="game__container">
            <Route path="/tictactoe" component={TicTacToe} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
