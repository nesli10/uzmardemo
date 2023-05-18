import { useState, useEffect } from "react";
import wordsData from "words.json";
import styles from "../styles/Hangman.module.css";
import Alert from "@mui/material/Alert";

const Game = () => {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<any[]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [score, setScore] = useState(0);

  useEffect(() => {
    selectWord();
  }, []);

  const selectWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsData.words.length);
    setWord(wordsData.words[randomIndex].toLowerCase());
  };

  const handleGuess = (letter: any) => {
    const lowercaseLetter = letter.toLowerCase();
    setGuesses([...guesses, lowercaseLetter]);

    if (word.includes(lowercaseLetter)) {
      const updatedScore = score + 10;
      setScore(updatedScore);
    } else {
      const updatedAttempts = remainingAttempts - 1;
      setRemainingAttempts(updatedAttempts);
    }
  };

  const renderWord = () => {
    return word
      .split("")
      .map((letter, index) => (
        <span key={index}>{guesses.includes(letter) ? letter : "_"}</span>
      ));
  };

  const renderHangman = () => {
    const wrongGuesses = guesses.filter(
      (guess) => !word.includes(guess)
    ).length;
    const imagePath = `./images/hangman_${wrongGuesses}.jpg`;
    return (
      <div className={styles.hangman_container}>
        <img
          src={imagePath}
          alt={`Hangman ${wrongGuesses}`}
          className={styles.hangman_image}
        />
        <p className={styles.remaining_attempts}>
          Remaining Attempts: {remainingAttempts}
        </p>
      </div>
    );
  };

  const handleRestart = () => {
    setGuesses([]);
    setRemainingAttempts(6);
    setScore(0);
    selectWord();
  };
  const alphabet = "ABCÇDEFGHIİJKLMNOÖPQRSŞTUÜVWXYZ";

  const renderButtons = () => {
    return alphabet.split("").map((letter) => (
      <button
        className={styles.word_button}
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guesses.includes(letter) || remainingAttempts <= 0}
      >
        {letter}
      </button>
    ));
  };
  const isGameWon = word.split("").every((letter) => guesses.includes(letter));
  const isGameLost = remainingAttempts <= 0;
  const renderMessage = () => {
    if (isGameWon) {
      return (
        <Alert
          variant="filled"
          severity="success"
          style={{ width: "20rem", alignItems: "center", marginLeft: "47rem" }}
        >
          Congratulations! You won!
        </Alert>
      );
    } else if (isGameLost) {
      return (
        <Alert
          variant="filled"
          severity="error"
          style={{ width: "20rem", alignItems: "center", marginLeft: "47rem" }}
        >
          Game over! You lost. The word was: {word}
        </Alert>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={styles.hangman_game}>
      <h1>Hangman Game</h1>
      {renderMessage()}
      <p className={styles.score}>Score: {score}</p>
      {renderHangman()}
      <p className={styles.word_display}>{renderWord()}</p>
      <div className={styles.button_container}>{renderButtons()}</div>
      <button className={styles.restart_button} onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
};
export default Game;
