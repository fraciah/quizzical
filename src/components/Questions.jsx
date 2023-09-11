import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

//decoding the HTML entities in the questions and answers, so that they are displayed correctly
function decodeHTMLEntities(text) {
    const entities = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#039;': "'",
        '&ouml;': 'ö',
        '&auml;': 'ä'
    };
    return text.replace(/&[^;]+;/g, match => entities[match] || match);
}

export default function Questions({ quizFinished }) {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(response => response.json())
            .then(data => {
                const { results } = data;
                console.log("Results:",results);
                // adding an 'isHeld' property to each answer
                const questionsWithAnswers = results.map(question => {
                    const answers = [question.correct_answer, ...question.incorrect_answers].map(answer => ({
                        answer: answer,
                        isHeld: false
                    }));
                    return {
                        // return a new object with all properties of the original question and an additional 'answers' property
                        ...question,
                        answers: answers
                    };
                });
                setQuestions(questionsWithAnswers);
            })
    }, []);

    function handleClick(questionIndex, answerIndex) {
        setQuestions(prevQuestions => {
            // console.log("questionIndex",questionIndex)
            // console.log("answerIndex",answerIndex)
            return prevQuestions.map((question, qIndex) => {
                if (qIndex === questionIndex) {
                    const newAnswers = question.answers.map((answer, aIndex) => {
                        if (aIndex === answerIndex) {
                            return { ...answer, isHeld: true }; // set isHeld to true for the clicked answer
                        }
                        return {...answer, isHeld: false}; //set isHeld to false for all other answers
                    });
                    return { ...question, answers: newAnswers };
                }
                return question;
            });
        });
    }

    return (
        <div className="questions">
            <h1>Questions</h1>
            <ol>
                {questions.map((question, questionIndex) => (
                    <li key={questionIndex}>
                        <h3>{decodeHTMLEntities(question.question)}</h3>
                        <div className="answers">
                            {question.answers.map((answer, answerIndex) => (
                                <div
                                    key={answerIndex}
                                    className={answer.isHeld ? "answer-held" : "answer"}
                                    onClick={() => handleClick(questionIndex, answerIndex)}
                                >
                                    {decodeHTMLEntities(answer.answer)} {answer.isHeld.toString()}
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
            <button className={quizFinished ? "won-button" : "play-button"}>Check answers</button>
        </div>
    )
}

Questions.propTypes = {
    quizFinished: PropTypes.bool.isRequired,
    setQuizFinished: PropTypes.func.isRequired
}
