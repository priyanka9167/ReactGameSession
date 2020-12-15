import React, { Component } from "react";
import ReactDOM from "react-dom";
import cs from "classnames";
import "./index.css";

const TICK_RATE = 100;
const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

const DIRECTION = {
  UP: "UP",
  BOTTOM: "BOTTOM",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
};

const DIRECTION_TICKS = {
  UP: (x, y) => ({ x, y: y - 1 }),
  BOTTOM: (x, y) => ({ x, y: y + 1 }),
  RIGHT: (x, y) => ({ x: x + 1, y }),
  LEFT: (x, y) => ({ x: x - 1, y }),
};

const KEY_CODES_MAPPER = {
  38: "UP",
  39: "RIGHT",
  37: "LEFT",
  40: "BOTTOM",
};

const getNumberFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomCoordinates = () => ({
  x: getNumberFromRange(1, GRID_SIZE - 1),
  y: getNumberFromRange(1, GRID_SIZE - 1),
});

const isBorder = (x, y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const getSnakeHead = (snake) => snake.coordinates[0];

const getSnakeTail = (snake) => snake.coordinates.slice(1);

const isSnake = (x, y, snakeCoordinate) =>
  snakeCoordinate.filter((coordinates) =>
    isPosition(coordinates.x, coordinates.y, x, y)
  ).length;

  const getIsSnakeOutside = (snake) =>
  getSnakeHead(snake).x >= GRID_SIZE ||
  getSnakeHead(snake).y >= GRID_SIZE ||
  getSnakeHead(snake).x <= 0 ||
  getSnakeHead(snake).y <= 0;

  const getIsSnakeClumy = snake => 
  {
    console.log( isSnake(
      getSnakeHead(snake).x,
      getSnakeHead(snake).y,
      getSnakeTail(snake)
    ))
  }
 


const isPosition = (x, y, diffX, diffY) => x === diffX && y === diffY;

const getCellCs = (isGameOver, snake, snack, x, y) =>
  cs("grid-cell", {
    "grid-cell-border": isBorder(x, y),
    "grid-cell-snake": isSnake(x, y, snake.coordinates),
    "grid-cell-snack": isPosition(
      x,
      y,
      snack.coordinates.x,
      snack.coordinates.y
    ),
    "grid-cell-hit":
      isGameOver &&
      isPosition(x, y, getSnakeHead(snake).x, getSnakeHead(snake).y),
  });

const initialState = {
  playground: {
    direction: DIRECTION.RIGHT,
    isGameOver: false,
  },
  snake: {
    coordinates: [getRandomCoordinates()],
  },
  snack: {
    coordinates: getRandomCoordinates(),
  },
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    window.addEventListener("keyup", this.onChangeDirection, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onChangeDirection, false);
    clearInterval(this.interval);
  }

  onChangeDirection = (event) => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      this.actionPerformed(
        "SNAKE_CHANGE_DIRECTION",
        KEY_CODES_MAPPER[event.keyCode]
      );
    }
  };

  actionPerformed = (type, action) => {
    switch (type) {
      case "SNAKE_CHANGE_DIRECTION":
        this.setState({
          ...this.state,
          playground: {
            ...this.state.playground,
            direction: action,
          },
        });
    }
  };

  onTick = () => {
    getIsSnakeClumy(this.state.snake);
  };

  componentDidUpdate(prevState) {
    this.interval = setInterval(this.onTick(), TICK_RATE);
  }

  render() {
    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid
          snake={this.state.snake}
          snack={this.state.snack}
          isGameOver={this.state.playground.isGameOver}
        ></Grid>
      </div>
    );
  }
}

const Grid = ({ isGameOver, snake, snack }) => (
  <div>
    {GRID.map((y) => (
      <Row y={y} key={y} snake={snake} snack={snack} isGameOver={isGameOver} />
    ))}
  </div>
);

const Row = ({ isGameOver, snake, snack, y }) => (
  <div className="grid-row">
    {GRID.map((x) => (
      <Cell
        x={x}
        y={y}
        key={x}
        snake={snake}
        snack={snack}
        isGameOver={isGameOver}
      />
    ))}
  </div>
);

const Cell = ({ isGameOver, snake, snack, x, y }) => (
  <div className={getCellCs(isGameOver, snake, snack, x, y)}></div>
);

ReactDOM.render(<App />, document.getElementById("root"));
