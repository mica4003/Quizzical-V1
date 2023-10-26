import React, { useEffect, useState } from "react";
import he from 'he'; // Import the 'he' library to decode HTML entities

export default function Questions() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isCorrect, setIsCorrect] = useState([]);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [answersChecked, setAnswersChecked] = useState(false);

    const fetchNewQuestions = () => {
        fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
            .then((res) => res.json())
            .then((data) => {
                const questionsWithShuffledAnswers = data.results.map((question) => {
                    const { correct_answer, incorrect_answers } = question;
                    const allAnswers = [...incorrect_answers, correct_answer];
                    // Shuffle the answers
                    for (let i = allAnswers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
                    }
                    return { ...question, answers: allAnswers };
                });
                setAllQuestions(questionsWithShuffledAnswers);
                setSelectedAnswers(Array(questionsWithShuffledAnswers.length).fill(null));
                setIsCorrect([]);
                setCorrectAnswerCount(0);
                setAnswersChecked(false);
            });
    };

    useEffect(() => {
        fetchNewQuestions(); // Fetch questions when the component initially mounts
    }, []);

    const handleAnswerClick = (questionIndex, answerIndex) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(newSelectedAnswers);
    };

    const checkAnswers = () => {
        const resultsArray = allQuestions.map((question, index) => {
            const selectedAnswerIndex = selectedAnswers[index];
            const correctAnswerIndex = question.answers.indexOf(question.correct_answer);
            return selectedAnswerIndex === correctAnswerIndex;
        });
        setIsCorrect(resultsArray);

        const correctCount = resultsArray.filter((isCorrect) => isCorrect).length;
        setCorrectAnswerCount(correctCount);
        setAnswersChecked(true);
    };

	
    return (
        <div className="questions-page">
            {allQuestions.map((questionEl, questionIndex) => (
                <div key={questionIndex} className="questions-container">
                    <p className="questions">{he.decode(questionEl.question)}</p>

					<div className="answers">
						{questionEl.answers.map((answer, answerIndex) => {
							const isSelected = selectedAnswers[questionIndex] === answerIndex;
							const isCorrectAnswer = answerIndex === questionEl.answers.indexOf(questionEl.correct_answer);
							const isIncorrectSelectedAnswer = isSelected && !isCorrectAnswer;
							
							return (
								<button
									key={answerIndex}
									onClick={() => handleAnswerClick(questionIndex, answerIndex)}
									className={`answer-button 
										${isSelected ? 'selected-answer' : ''}
										${answersChecked && isIncorrectSelectedAnswer ? 'incorrect-selected-answer' : ''}
										${answersChecked && isCorrectAnswer ? 'correct-answer' : ''}
									`}
								>
									{he.decode(answer)}
								</button>
							);
						})}
					</div>


                    <br />
                </div>
            ))}

            {!answersChecked && (
                <button className="check-btn" id="check-btn" onClick={checkAnswers}>
                    Check Answers
                </button>
            )}
            {answersChecked && (
                <div className="result-container">
                    <p>{`You scored ${correctAnswerCount}/${allQuestions.length} correct answers`}</p>
                    <button className="restart-btn" onClick={fetchNewQuestions}>
                        Play again
                    </button>
                </div>
            )}
        </div>
    );
}
