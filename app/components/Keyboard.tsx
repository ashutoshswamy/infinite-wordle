import { motion } from 'framer-motion';
import { LetterStatus } from '../lib/gameLogic';
import styles from './Keyboard.module.css';

interface KeyboardProps {
  onKeypress: (key: string) => void;
  statuses: Record<string, LetterStatus>;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export default function Keyboard({ onKeypress, statuses }: KeyboardProps) {
  const onClick = (key: string) => {
    onKeypress(key);
  };

  return (
    <div className={styles.keyboard}>
      {KEYS.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((key) => {
            const isLarge = key === 'Enter' || key === 'Backspace';
            const status = statuses[key];
            const statusClass = status ? styles[status] : '';

            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.9 }}
                className={`${styles.key} ${isLarge ? styles.keyLarge : styles.keyNormal} ${statusClass}`}
                onClick={() => onClick(key)}
              >
                {key === 'Backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
                  </svg>
                ) : (
                  key
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
