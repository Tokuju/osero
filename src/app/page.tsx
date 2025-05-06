'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [turnColor, setTurnColor] = useState(1);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
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
  const directions = useMemo(
    () => [
      [1, 0],
      [-1, 0],
      [0, -1],
      [1, -1],
      [-1, -1],
      [1, 1],
      [0, 1],
      [-1, 1],
    ],
    [],
  );
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
  const hasValidMove = (color: number, board: number[][]) => {
    return getValidMoves(color, board).length > 0;
  };
  const getValidMoves = useCallback(
    (color: number, board: number[][]): [number, number][] => {
      const moves: [number, number][] = [];
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
              moves.push([y, x]);
              break;
            }
          }
        }
      }
      return moves;
    },
    [directions],
  );
  const checkWinner = (board: number[][]) => {
    const { black, white } = countStones(board);
    if (black > white) return '黒の勝ち！';
    if (white > black) return '白の勝ち！';
    return '引き分け！';
  };
  const handlePass = () => {
    if (validMoves.length > 0) {
      alert('まだ置ける場所があります！');
      return;
    }
    const nextColor = 3 - turnColor;
    if (hasValidMove(nextColor, board)) {
      setTurnColor(nextColor);
    } else {
      alert('両者とも置ける場所がありません。ゲーム終了！');
    }
  };
  const clickHandler = (x: number, y: number) => {
    const isValid = validMoves.some(([vy, vx]) => vx === x && vy === y);
    if (!isValid) return;
    const newBoard = structuredClone(board);
    let flipped = false;
    for (const [dy, dx] of directions) {
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
        for (const [fy, fx] of toFlip) {
          newBoard[fy][fx] = turnColor;
        }
        flipped = true;
      }
    }
    if (flipped) {
      newBoard[y][x] = turnColor;
      const nextColor = 3 - turnColor;
      setBoard(newBoard);
      if (hasValidMove(nextColor, newBoard)) {
        setTurnColor(nextColor);
      } else if (hasValidMove(turnColor, newBoard)) {
        alert(`プレイヤー${nextColor}は置ける場所がないためスキップされました`);
      } else {
        const winner = checkWinner(newBoard);
        alert(`両者とも置ける場所がありません。ゲーム終了！\n${winner}`);
      }
    }
  };
  useEffect(() => {
    setValidMoves(getValidMoves(turnColor, board));
  }, [turnColor, board, getValidMoves]);
  const { black, white } = countStones(board);
  return (
    <div className={styles.container}>
      <div
        className={styles.startscreen}
        style={{ display: showStartScreen ? 'flex' : 'none' }}
        onClick={() => setShowStartScreen(false)}
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
        </div>
      </div>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => {
            const isValid = validMoves.some(([vy, vx]) => vy === y && vx === x);
            return (
              <div
                key={`${x}-${y}`}
                className={styles.cell}
                onClick={() => clickHandler(x, y)}
                style={{ background: isValid ? '#AAFFAA' : '' }}
              >
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
