import { useState, useEffect, useCallback } from 'react';
import { getRandomWord, isValidWord, evaluateGuess, LetterStatus } from '../lib/gameLogic';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
}

export function useWordle() {
  const [isReady, setIsReady] = useState(false);
  const [wordLength, setWordLength] = useState<number>(5);
  const [maxAttempts, setMaxAttempts] = useState<number>(6);
  
  const [targetWord, setTargetWord] = useState<string>('');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  
  const [stats, setStats] = useState<GameStats>({
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
  });

  // Shake animation trigger
  const [shakeRow, setShakeRow] = useState<boolean>(false);
  // Invalid word toast message trigger
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem('infiniteWordleStats', JSON.stringify(newStats));
    } catch {}
  };

  const startNewGame = useCallback((length: number = wordLength) => {
    setTargetWord(getRandomWord(length));
    setCurrentGuess('');
    setGuesses([]);
    setGameStatus('playing');
    setToastMessage(null);
  }, [wordLength]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const applySettings = (newLength: number, newAttempts: number) => {
    setWordLength(newLength);
    setMaxAttempts(newAttempts);
    startNewGame(newLength);
  };

  // Initialize game and load stats on mount ONLY
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTargetWord(getRandomWord(5)); // Default length
    try {
      const savedStats = localStorage.getItem('infiniteWordleStats');
      if (savedStats) setStats(JSON.parse(savedStats));
    } catch {}
    /* eslint-enable react-hooks/set-state-in-effect */
    setIsReady(true);
  }, []); // Empty dependency array ensures this runs only once on client-side mount

  const handleKeyup = useCallback(
    ({ key }: KeyboardEvent) => {
      if (gameStatus !== 'playing') {
        if (key === 'Enter') startNewGame(); // Quick restart
        return;
      }
      
      const letterMatch = /^[A-Za-z]$/;

      if (key === 'Enter') {
        if (currentGuess.length !== wordLength) {
          setShakeRow(true);
          showToast('Not enough letters');
          setTimeout(() => setShakeRow(false), 500);
          return;
        }

        if (!isValidWord(currentGuess)) {
          setShakeRow(true);
          showToast('Not in word list');
          setTimeout(() => setShakeRow(false), 500);
          return;
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === targetWord) {
          setGameStatus('won');
          saveStats({
            played: stats.played + 1,
            won: stats.won + 1,
            currentStreak: stats.currentStreak + 1,
            maxStreak: Math.max(stats.currentStreak + 1, stats.maxStreak),
          });
        } else if (newGuesses.length >= maxAttempts) {
          setGameStatus('lost');
          saveStats({
            played: stats.played + 1,
            won: stats.won,
            currentStreak: 0,
            maxStreak: stats.maxStreak,
          });
        }
      }

      if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (letterMatch.test(key)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess((prev) => prev + key.toUpperCase());
        }
      }
    },
    [currentGuess, gameStatus, guesses, targetWord, wordLength, maxAttempts, stats, startNewGame]
  );
  
  // Calculate keyboard statuses for painting
  const keyboardStatuses: Record<string, LetterStatus> = {};
  guesses.forEach((guess) => {
    const statuses = evaluateGuess(guess, targetWord);
    guess.split('').forEach((letter, i) => {
      const currentStatus = keyboardStatuses[letter];
      const newStatus = statuses[i];
      // Priority: correct > present > absent
      if (newStatus === 'correct' || (newStatus === 'present' && currentStatus !== 'correct') || (newStatus === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present')) {
        keyboardStatuses[letter] = newStatus;
      }
    });
  });

  return {
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
  };
}
