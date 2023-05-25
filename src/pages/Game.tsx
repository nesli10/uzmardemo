import { useState, useEffect } from "react";
import styles from "../styles/Hangman.module.css";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import io, { Socket } from "socket.io-client";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useState(false);
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<any[]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [score, setScore] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [opponentScore, setOpponentScore] = useState(0);

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handleRoomChange = (event: any) => {
    setRoom(event.target.value);
  };

  const joinRoom = () => {
    if (username && room) {
      socketInitializer();
    }
  };

  async function socketInitializer() {
    await fetch("/api/socket2");

    const socket = io();

    socket.emit("joinRoom", { username, room }, (success: any) => {
      if (success) {
        setWaitingForSecondPlayer(true);
        setSocket(socket);
      } else {
        alert("Failed to join the room. Please try again.");
      }
    });

    socket.on(
      "gameStarted",
      ({
        word,
        opponent,
      }: {
        word: string;
        opponent: { username: string; score: number };
      }) => {
        setGameStarted(true);
        setWaitingForSecondPlayer(false);
        setWord(word.toLowerCase());
        setOpponentUsername(opponent.username);
        setOpponentScore(opponent.score);
      }
    );

    socket.on("wordSelected", (selectedWord: string) => {
      setWord(selectedWord.toLowerCase());
    });
  }

  const handleGuess = (letter: any, event: any) => {
    //oyuncunun kendi tahmini
    const lowercaseLetter = letter.toLowerCase();
    setGuesses([...guesses, lowercaseLetter]);

    if (word.includes(lowercaseLetter)) {
      const updatedScore = score + 10;
      event.target.disabled = "disabled";
      event.target.setAttribute("founded", "founded");
      setScore(updatedScore);
      if (socket) {
        socket.emit("guessMade", {
          letter,
          room,
          username,
          score: updatedScore,
        });
      }
    } else {
      const updatedAttempts = remainingAttempts - 1;
      event.target.disabled = "disabled";
      setRemainingAttempts(updatedAttempts);
    }
  };

  const renderWord = () => {
    if (gameStarted && word) {
      return word
        .split("")
        .map((letter, index) => (
          <span key={index}>{guesses.includes(letter) ? letter : "_"}</span>
        ));
    }

    return null;
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
  const isGameWon = word.split("").every((letter) => guesses.includes(letter));
  const isGameLost = remainingAttempts <= 0;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const renderButtons = () => {
    return alphabet.split("").map((letter) => (
      <button
        className={styles.word_button}
        key={letter}
        onClick={(e) => handleGuess(letter, e)}
        disabled={
          guesses.includes(letter) || remainingAttempts <= 0 || isGameWon
        }
      >
        {letter}
      </button>
    ));
  };

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
    } else if (gameStarted) {
      return null;
    }
  };
  const handleRestart = () => {
    setGuesses([]);
    setRemainingAttempts(6);
    setScore(0);
    setWord("");
    setOpponentScore(0);
    setGameStarted(false);
    setRoom("");
    setUsername("");
    const wordButtons = document.querySelectorAll(
      `.${styles.word_button}[founded]`
    );
    wordButtons.forEach((button) => {
      button.removeAttribute("founded");
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("guessMade", (data: any) => {
        const { letter, username: playerUsername, score: playerScore } = data;
        if (playerUsername !== username) {
          handleGuess(letter, { target: { disabled: "disabled" } });

          setOpponentScore(playerScore);
        }
      });
    }
  }, [socket, username]);

  return (
    <div className={styles.hangman_game}>
      <h1>Hangman Game</h1>
      {!gameStarted ? (
        <div style={{ paddingTop: "40px" }}>
          <TextField
            id="outlined-basic"
            value={username}
            onChange={handleUsernameChange}
            label="Enter your username"
            variant="outlined"
          />
          <TextField
            style={{ marginLeft: "15px" }}
            id="outlined-basic"
            value={room}
            onChange={handleRoomChange}
            label="Enter the room ID"
            variant="outlined"
          />
          <Button
            style={{ margin: "15px" }}
            variant="contained"
            onClick={joinRoom}
          >
            Join Room
          </Button>

          {waitingForSecondPlayer && <p>Waiting for the second player...</p>}
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}!</h2>
          <h3>Opponent: {opponentUsername}</h3>
          {renderMessage()}
          <p className={styles.score}>Score: {score}</p>
          <div className={styles.opponentInfo}>
            <h3>Opponent's Score: {opponentScore}</h3>
          </div>
          {renderHangman()}
          <p className={styles.word_display}>{renderWord()}</p>
          <div className={styles.button_container}>{renderButtons()}</div>
          <button className={styles.restart_button} onClick={handleRestart}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
