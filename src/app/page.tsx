'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const checkWinner = (board: number[][]) => {
    const { black, white } = countStones(board);
    if (black > white) return '黒の勝ち！';
    if (white > black) return '白の勝ち！';
    return '引き分け！';
  };

  const handlePass = () => {
    const nextColor = 3 - turnColor;
    if (hasValidMove(nextColor, board)) {
      setTurnColor(nextColor);
    } else {
      alert('両者とも置ける場所がありません。ゲーム終了！');
    }
  };
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [turnColor, setTurnColor] = useState(1);
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

  const countStones = (board: number[][]) => {
    let black = 0;
    let white = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell === 1) black++;
        if (cell === 2) white++;
      }
    }
    return { black, white };
  };

  const { black, white } = countStones(board);

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
        const winner = checkWinner(newBoard);
        alert('両者とも置ける場所がありません。ゲーム終了！');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.startscreen}
        style={{ display: showStartScreen ? 'flex' : 'none' }}
        onClick={() => {
          setShowStartScreen(false);
        }}
      >
        <div className={styles.text}>Othello</div>
        <div className={styles.text1}>Game start</div>
        <div className={styles.text2}>クリック here!!!</div>
      </div>

      <div className={styles.score}>
        <div style={{ color: 'black' }}>黒: {black}</div>
        <div style={{ color: 'black' }}>白: {white}</div>
        <div style={{ marginTop: '20px', fontSize: '32px' }}>
          現在のターン: {turnColor === 1 ? '黒' : '白'}
          <button className={styles.passButton} onClick={handlePass}>
            パスする
          </button>
          <div className="topBar" />
        </div>
      </div>

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
    </div>
  );
}
