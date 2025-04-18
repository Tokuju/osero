'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [board, setBorad] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.cell}>
          <div className={styles.stone} />
        </div>
      </div>
    </div>
  );
}
