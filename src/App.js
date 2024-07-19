import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [1, 0],
  [-1, 1],
  [-1, -1],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speed);
  }, [speed]);

  return (
    <div className="App">
      <header className="App-header">
        Conway's Game of Life
      </header>
      <div className="grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              className={`cell ${grid[i][k] ? 'alive' : ''}`}
            />
          ))
        )}
      </div>
      <footer className="App-footer">
      <div className="buttons">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={() => setGrid(generateEmptyGrid())}
        >
          Clear
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
            }
            setGrid(rows);
          }}
        >
          Random
        </button>
      </div>
     
        <div className="speed-control">
          <label>Speed: </label>
          <input
            type="range"
            min="100"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
