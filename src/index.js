import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const isWinnerClass = props.winner ? 'square winner' : 'square';
  return (
    <button
      onClick={props.onClick}
      className={isWinnerClass} 
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const isWin = this.props.linesWinner && this.props.linesWinner.includes(i); 
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={isWin}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      selectedMove: null,
      amountOfMove: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      selectedMove: null,
      amountOfMove: this.state.amountOfMove + 1,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedMove: step,
      amountOfMove: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const returnCalculateWinner = calculateWinner(current.squares);
    var winner = null;
    var linesWinner = null;
    if (returnCalculateWinner) {
      winner = returnCalculateWinner[0];
      linesWinner = returnCalculateWinner[1]
    }

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
      const isBoldActived = this.state.selectedMove === move ? 'showbold' : '';
      return (
        <li key={move}>
          <button className={isBoldActived} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      
    } else if (this.state.amountOfMove === 9) {
      status = 'No Winner!!!';

    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            linesWinner={linesWinner}
            amountOfMove={this.state.amountOfMove}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
