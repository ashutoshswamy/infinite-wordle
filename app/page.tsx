"use client";

import { useEffect, useState } from 'react';
import { Settings, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWordle } from './hooks/useWordle';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import SettingsModal from './components/SettingsModal';
import StatsModal from './components/StatsModal';
import styles from './page.module.css';

export default function Home() {
  const {
    isReady,
    wordLength,
    maxAttempts,
    targetWord,
    currentGuess,
    guesses,
    gameStatus,
    stats,
    shakeRow,
    toastMessage,
    keyboardStatuses,
    handleKeyup,
    startNewGame,
    applySettings,
  } = useWordle();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      setTimeout(() => {
        setIsStatsOpen(true);
      }, 1500); // 1.5s delay to let animations finish
    }
  }, [gameStatus]);

  if (!isReady) return null;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div style={{ width: 48 }}></div> {/* Spacer for centering title */}
        <h1 className={styles.title}>WORDLE</h1>
        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} onClick={() => setIsStatsOpen(true)}>
            <BarChart2 size={24} />
          </button>
          <button className={styles.iconBtn} onClick={() => setIsSettingsOpen(true)}>
            <Settings size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={styles.toast}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        targetWord={targetWord}
        wordLength={wordLength}
        maxAttempts={maxAttempts}
        shakeRow={shakeRow}
      />

      <div style={{ paddingBottom: '16px' }}>
        <Keyboard 
          onKeypress={(key) => handleKeyup({ key } as KeyboardEvent)} 
          statuses={keyboardStatuses} 
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLength={wordLength}
        currentAttempts={maxAttempts}
        onApply={(len, att) => {
          applySettings(len, att);
        }}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        gameStatus={gameStatus}
        targetWord={targetWord}
        onNextGame={() => {
          setIsStatsOpen(false);
          startNewGame();
        }}
      />
      <footer className={styles.footer}>
        <p>Built by Ashutosh Swamy</p>
        <div className={styles.socialLinks}>
          <a href="https://github.com/ashutoshswamy" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/ashutoshswamy" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://x.com/ashutoshswamy_" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
