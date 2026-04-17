import React, { useState } from 'react';

const quizData = [
  // VALORANT QUESTIONS
  { question: "In Valorant, how many rounds are played before sides switch?", options: ["10 Rounds", "12 Rounds", "13 Rounds", "15 Rounds"], answer: 1 },
  { question: "Which Valorant agent says 'Watch this!' before using their ultimate?", options: ["Jett", "Phoenix", "Raze", "Yoru"], answer: 0 },
  { question: "What is the name of the currency used to buy weapons in a match?", options: ["Gold", "Credits", "Creds", "VP"], answer: 2 },
  { question: "Which map features three bomb sites?", options: ["Bind", "Haven", "Split", "Ascent"], answer: 1 },
  { question: "What type of weapon is the 'Operator'?", options: ["Sniper Rifle", "Assault Rifle", "Shotgun", "SMG"], answer: 0 },
  // LEAGUE OF LEGENDS QUESTIONS
  { question: "Which champion is known as the 'Unforgiven'?", options: ["Yone", "Riven", "Yasuo", "Zed"], answer: 2 },
  { question: "What is the maximum number of items a player can hold in their inventory (excluding trinket)?", options: ["5", "6", "7", "4"], answer: 1 },
  { question: "Which objective spawns at 20 minutes in the Baron Pit?", options: ["Rift Herald", "Elder Dragon", "Baron Nashor", "Dragon Soul"], answer: 2 },
  { question: "What role typically goes to the Bottom Lane with the ADC?", options: ["Jungler", "Support", "Top Laner", "Mid Laner"], answer: 1 },
  { question: "Which region has won the most World Championships?", options: ["LCS (NA)", "LEC (EU)", "LCK (Korea)", "LPL (China)"], answer: 2 }
];

function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    if (selectedOption === quizData[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Wait 2 seconds, then advance
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsSubmitted(false);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  const getFinalMessage = () => {
    if (score === 10) return "Perfect! You're a true Riot Games fan!";
    if (score >= 7) return "Great job! You know your stuff.";
    if (score >= 4) return "Not bad, but room for improvement.";
    return "Time to play more games!";
  };

  return (
    <section className="section alt-bg quiz-section">
      <div className="container">
        <h2>Test Your Knowledge</h2>
        <p>Think you know Riot Games? Take this 10-question quiz!</p>
        
        <div className="quiz-container">
          {showResult ? (
            <div className="quiz-result-screen">
              <h3>Quiz Completed!</h3>
              <div className="score-display" style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                You scored {score} / {quizData.length}
              </div>
              <p style={{ marginBottom: '20px' }}>{getFinalMessage()}</p>
              <button className="btn" style={{ backgroundColor: 'var(--secondary)' }} onClick={restartQuiz}>
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="quiz-header">
                <h3>{quizData[currentQuestion].question}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '15px' }}>
                  Question {currentQuestion + 1} of {quizData.length}
                </p>
              </div>

              <div className="quiz-options">
                {quizData[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => handleSelect(index)}
                    disabled={isSubmitted}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="quiz-controls" style={{ marginTop: '20px' }}>
                {isSubmitted && (
                  <div className={`quiz-result ${selectedOption === quizData[currentQuestion].answer ? 'correct' : 'wrong'}`} style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                    {selectedOption === quizData[currentQuestion].answer 
                      ? "Correct! Nice job." 
                      : `Wrong! The correct answer was: ${quizData[currentQuestion].options[quizData[currentQuestion].answer]}`}
                  </div>
                )}
                
                {!isSubmitted && (
                  <button 
                    className="btn" 
                    onClick={handleSubmit} 
                    disabled={selectedOption === null}
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default TriviaGame;