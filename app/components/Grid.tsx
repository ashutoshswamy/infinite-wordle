import { motion } from 'framer-motion';
import { evaluateGuess, LetterStatus } from '../lib/gameLogic';
import styles from './Grid.module.css';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  wordLength: number;
  maxAttempts: number;
  shakeRow: boolean;
}

export default function Grid({
  guesses,
  currentGuess,
  targetWord,
  wordLength,
  maxAttempts,
  shakeRow,
}: GridProps) {
  const empties =
    maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0);

  // Dynamic CSS variables for tile sizing based on length/attempts
  // We'll set a standard size and let CSS scale it if needed
  const tileSize = wordLength > 6 ? '50px' : wordLength > 5 ? '56px' : '62px';

  return (
    <div className={styles.grid} style={{ '--tile-size': tileSize } as React.CSSProperties}>
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          guess={guess}
          targetWord={targetWord}
        />
      ))}

      {guesses.length < maxAttempts && (
        <CurrentRow
          guess={currentGuess}
          wordLength={wordLength}
          shakeRow={shakeRow}
        />
      )}

      {Array.from({ length: empties }).map((_, i) => (
        <EmptyRow key={i} wordLength={wordLength} />
      ))}
    </div>
  );
}

function CompletedRow({
  guess,
  targetWord,
}: {
  guess: string;
  targetWord: string;
}) {
  const statuses = evaluateGuess(guess, targetWord);

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'var(--correct)';
      case 'present': return 'var(--present)';
      case 'absent': return 'var(--absent)';
      default: return 'transparent';
    }
  };

  return (
    <div className={styles.row}>
      {guess.split('').map((letter, i) => (
        <motion.div
          key={i}
          className={`${styles.tileWrapper}`}
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: 180,
          }}
          transition={{
            delay: i * 0.15,
            duration: 0.5,
          }}
        >
          {/* Inner container to hold the face and back */}
          <motion.div
            className={styles.tile}
            initial={{ backgroundColor: 'transparent', borderColor: 'var(--key-bg)', color: 'var(--fg)' }}
            animate={{
              backgroundColor: getStatusColor(statuses[i]),
              borderColor: getStatusColor(statuses[i]),
              color: '#ffffff',
            }}
            transition={{
              delay: i * 0.15 + 0.25, // Change color midway through flip
              duration: 0.1,
            }}
            style={{ rotateX: 180 }} // Keeps letter upright
          >
            {letter}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function CurrentRow({ guess, wordLength, shakeRow }: { guess: string; wordLength: number; shakeRow: boolean }) {
  const splitGuess = guess.split('');
  const emptyCells = Array.from({ length: wordLength - splitGuess.length });

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
    initial: { x: 0 },
  };

  return (
    <motion.div
      className={styles.row}
      variants={shakeVariants}
      animate={shakeRow ? 'shake' : 'initial'}
    >
      {splitGuess.map((letter, i) => (
        <div key={i} className={`${styles.tile} ${styles.tileFilled}`}>
          {letter}
        </div>
      ))}
      {emptyCells.map((_, i) => (
        <div key={i} className={styles.tile} />
      ))}
    </motion.div>
  );
}

function EmptyRow({ wordLength }: { wordLength: number }) {
  const emptyCells = Array.from({ length: wordLength });
  return (
    <div className={styles.row}>
      {emptyCells.map((_, i) => (
        <div key={i} className={styles.tile} />
      ))}
    </div>
  );
}
