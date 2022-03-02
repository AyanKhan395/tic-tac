import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


let cursorStyle;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={cursorStyle}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row" >
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
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  undoFunction(step) {
    if(step > 0 && this.state.stepNumber > 0){
      if(step > 0 && step === this.state.stepNumber){
        this.setState({
          stepNumber: step-1,
          xIsNext: ((step-1) % 2) === 0
        });
      }else if(step !== this.state.stepNumber){
        this.setState({
          stepNumber: this.state.stepNumber-1,
          xIsNext: ((this.state.stepNumber-1) % 2) === 0
        });
      }
    }
  }
  
  
  redoFunction(step) {
    if(step < this.state.history.length && this.state.stepNumber < this.state.history.length){
      if(step < 10 && step === this.state.stepNumber){
        this.setState({
          stepNumber: step,
          xIsNext: ((step) % 2) === 0
        });
      }else if(step !== this.state.stepNumber){
        this.setState({
          stepNumber: this.state.stepNumber+1,
          xIsNext: ((this.state.stepNumber+1) % 2) === 0
        });
      }
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = calculateDraw(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let moveStep = history.length-1;
    const movesFunction = (
    <div>
        <li >
          <button onClick={() => this.undoFunction(moveStep)}>Undo</button>
          
          <button onClick={() => this.redoFunction(moveStep)}>Redo</button>
        </li>
    </div>
  );
    

    let status;
    let divStyle;
    if (winner) {
      status = "Winner: " + winner;
      divStyle = {
        color: 'green',
      };
      cursorStyle = {
        cursor: 'not-allowed',
        color: 'grey',
      };
    } else if (draw) {
      status = "Game Draw";
      divStyle = {
        color: 'grey',
      };
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      divStyle = {
        color: 'black',
      };
      cursorStyle = {
        cursor: 'default',
        color: 'black',
      };
    }

    return (
      <div className="game">
        <div className="game-board" >
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div style={divStyle}>{status}</div>
          <ul>{movesFunction}</ul>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateDraw(squares) {
  let count = 0;
  for (let i = 0; i < 9; i++) {
    if (squares[i] !== null) {
      count++;
    }
  }
  if(count > 8){
    return 1;
  }else{
    return 0;
  }
}



// ========================================



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
