import Modal from './Modal';
import { GameStats, GameStatus } from '../hooks/useWordle';
import styles from './StatsModal.module.css';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  gameStatus: GameStatus;
  targetWord: string;
  onNextGame: () => void;
}

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  gameStatus,
  targetWord,
  onNextGame,
}: StatsModalProps) {
  const winPercent = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const isGameOver = gameStatus !== 'playing';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{stats.played}</span>
          <span className={styles.statLabel}>Played</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{winPercent}</span>
          <span className={styles.statLabel}>Win %</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{stats.currentStreak}</span>
          <span className={styles.statLabel}>Current Streak</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{stats.maxStreak}</span>
          <span className={styles.statLabel}>Max Streak</span>
        </div>
      </div>

      {isGameOver && (
        <div className={styles.gameOverSection}>
          <div className={styles.resultText}>
            {gameStatus === 'won' ? 'You guessed it!' : 'Out of attempts!'}
          </div>
          <div className={styles.targetWord}>The word was: <strong>{targetWord}</strong></div>
          <button className={styles.nextButton} onClick={onNextGame}>
            Play Next Word
          </button>
        </div>
      )}
    </Modal>
  );
}
