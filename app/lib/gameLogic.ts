import words from 'an-array-of-english-words';

// We can cache Sets for different lengths to make validation O(1)
const wordSets = new Map<number, Set<string>>();
const wordLists = new Map<number, string[]>();

function initializeListForLength(length: number) {
  if (!wordLists.has(length)) {
    const filtered = words.filter((w) => w.length === length);
    wordLists.set(length, filtered);
    wordSets.set(length, new Set(filtered));
  }
}

export function getRandomWord(length: number): string {
  initializeListForLength(length);
  const list = wordLists.get(length)!;
  if (list.length === 0) {
    // Fallback if no words of that length exist (unlikely for 4-8)
    return 'A'.repeat(length);
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex].toUpperCase();
}

export function isValidWord(word: string): boolean {
  const length = word.length;
  initializeListForLength(length);
  const set = wordSets.get(length)!;
  return set.has(word.toLowerCase());
}

export type LetterStatus = 'correct' | 'present' | 'absent' | 'unused';

export function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const guessChars = guess.split('');
  const targetChars = target.split('');
  const result: LetterStatus[] = Array(guess.length).fill('absent');

  // First pass: mark 'correct'
  for (let i = 0; i < guess.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
      targetChars[i] = ''; 
      guessChars[i] = '';  
    }
  }

  // Second pass: mark 'present'
  for (let i = 0; i < guess.length; i++) {
    if (guessChars[i] !== '') {
      const targetIndex = targetChars.indexOf(guessChars[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetChars[targetIndex] = ''; 
      }
    }
  }

  return result;
}
