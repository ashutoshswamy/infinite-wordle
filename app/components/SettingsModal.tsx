import { useState } from 'react';
import Modal from './Modal';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLength: number;
  currentAttempts: number;
  onApply: (length: number, attempts: number) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentLength,
  currentAttempts,
  onApply,
}: SettingsModalProps) {
  const [length, setLength] = useState(currentLength);
  const [attempts, setAttempts] = useState(currentAttempts);

  const handleApply = () => {
    onApply(length, attempts);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className={styles.section}>
        <div className={styles.header}>
          <h3>Word Length</h3>
          <span>{length} letters</span>
        </div>
        <input
          type="range"
          min="4"
          max="8"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.rangeLabels}>
          <span>4</span>
          <span>8</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h3>Difficulty</h3>
        </div>
        <div className={styles.options}>
          <button
            className={`${styles.optionBtn} ${attempts === 7 ? styles.selected : ''}`}
            onClick={() => setAttempts(7)}
          >
            Easy (7 tries)
          </button>
          <button
            className={`${styles.optionBtn} ${attempts === 6 ? styles.selected : ''}`}
            onClick={() => setAttempts(6)}
          >
            Normal (6 tries)
          </button>
          <button
            className={`${styles.optionBtn} ${attempts === 5 ? styles.selected : ''}`}
            onClick={() => setAttempts(5)}
          >
            Hard (5 tries)
          </button>
        </div>
      </div>

      <div className={styles.warning}>
        Applying changes will restart the current game immediately.
      </div>

      <button className={styles.applyBtn} onClick={handleApply}>
        Apply & Restart
      </button>
    </Modal>
  );
}
