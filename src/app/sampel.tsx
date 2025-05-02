'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [showStartScreen, setShowStartScreen] = useState(true); // ← 追加
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, -1],
    [-1, -1],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

  const hasValidMove = (color: number, board: number[][]) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] !== 0) continue;
        for (let i = 0; i < directions.length; i++) {
          const [dy, dx] = directions[i];
          let cy = y + dy;
          let cx = x + dx;
          let hasOpponent = false;
          while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === 3 - color) {
            cy += dy;
            cx += dx;
            hasOpponent = true;
          }
          if (hasOpponent && cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && board[cy][cx] === color) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    let Flipped = false;
    for (let i = 0; i < directions.length; i++) {
      const [dy, dx] = directions[i];
      const toFlip: [number, number][] = [];
      let cy = y + dy;
      let cx = x + dx;
      while (cx >= 0 && cx < 8 && cy >= 0 && cy < 8 && newBoard[cy][cx] === 3 - turnColor) {
        toFlip.push([cy, cx]);
        cy += dy;
        cx += dx;
      }
      if (
        cx >= 0 &&
        cx < 8 &&
        cy >= 0 &&
        cy < 8 &&
        newBoard[cy][cx] === turnColor &&
        toFlip.length > 0
      ) {
        for (let k = 0; k < toFlip.length; k++) {
          const [fy, fx] = toFlip[k];
          newBoard[fy][fx] = turnColor;
        }
        Flipped = true;
      }
    }
    if (Flipped) {
      newBoard[y][x] = turnColor;
      const nextColor = 3 - turnColor;
      setBoard(newBoard);

      if (hasValidMove(nextColor, newBoard)) {
        setTurnColor(nextColor);
      } else if (hasValidMove(turnColor, newBoard)) {
        alert(`プレイヤー${nextColor}は置ける場所がないためスキップされました`);
      } else {
        alert('両者とも置ける場所がありません。ゲーム終了！');
      }
    }
  };

  return (
    <div className={styles.container}>
      {showStartScreen ? (
        <div
          className={styles.startscreen}
          onClick={() => {
            console.log('Start screen clicked');
            setShowStartScreen(false);
          }}
        >
          <div className={styles.text}>Othello</div>
          <div className={styles.text}>Game start</div>
          <div className={styles.text2}>クリックしてね</div>
        </div>
      ) : (
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
              </div>
            )),
          )}
        </div>
      )}
    </div>
  );
}
