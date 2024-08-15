import React, { useState, useEffect, useMemo } from 'react';
import './Generate.scss';

const Generate = () => {
  const [input, setInput] = useState('');
  const [randomNum, setRandomNum] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const difficultySettings = useMemo(() => ({
    Easy: { max: 50, attempts: 15, baseScore: 1000, guessPenalty: 20, timePenalty: 2, winBonus: 100 },
    Medium: { max: 100, attempts: 10, baseScore: 1500, guessPenalty: 30, timePenalty: 3, winBonus: 150 },
    Hard: { max: 200, attempts: 7, baseScore: 2000, guessPenalty: 50, timePenalty: 5, winBonus: 200 },
  }), []);

  useEffect(() => {
    if (difficulty) {
      const settings = difficultySettings[difficulty];
      setAttempts(settings.attempts);
      setPoints(settings.baseScore);
      setRandomNum(Math.ceil(Math.random() * settings.max));
      setStartTime(Date.now());
    }
  }, [difficulty, difficultySettings]);

  const handleVerify = () => {
    const guessNumber = parseInt(input, 10);
    const settings = difficultySettings[difficulty];
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

    if (guessNumber === randomNum) {
      const finalScore = points + settings.winBonus - settings.timePenalty * timeElapsed;
      setMessage(`Success! You've guessed the number. Your score is ${finalScore}`);
      setAttempts(0);
    } else if (attempts > 1) {
      const newPoints = points - settings.guessPenalty - settings.timePenalty * timeElapsed;
      setAttempts(attempts - 1);
      setPoints(newPoints);
      setMessage(guessNumber < randomNum ? `Too low! Try again. You have ${attempts - 1} attempts left.` : `Too high! Try again. You have ${attempts - 1} attempts left.`);
    } else {
      setMessage(`Game over! The correct number was ${randomNum}. Your score is ${points}`);
      setAttempts(0);
    }
  };

  const handleRetry = () => {
    setInput('');
    setDifficulty('');
    setAttempts(0);
    setMessage('');
    setPoints(0);
    setStartTime(null);
    setRandomNum(null);
  };

  return (
    <div className="container">
      <h2>Guessing Game</h2>
      {!difficulty ? (
        <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      ) : (
        <div>
          <p className="attempts">Attempts left: {attempts}</p>
          <p>Score: {points}</p>
          <input
            type="number"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Enter your guess"
          />
          <button onClick={handleVerify}>Verify</button>
          <p className={`message ${message.startsWith('Success') ? 'success' : 'failure'}`}>{message}</p>
          {(message.startsWith('Success') || message.startsWith('Game over')) && (
            <button className="retry-button" onClick={handleRetry}>
              <span className="retry-icon">🔄</span> Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Generate;
