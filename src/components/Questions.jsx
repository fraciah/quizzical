import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

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

export default function Questions({ quizFinished, setQuizFinished }) {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]); //useState to keep track of the questions
    const [checkClicked, setCheckClicked] = useState(false); //keeping track of whether the check button has been clicked
    const [correctAnswers, setCorrectAnswers] = useState(0); //useState to keep track of the number of correct answers


    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
            .then(response => response.json())
            .then(data => {
                const { results } = data;
                console.log("Results:",results);
                // adding an 'isHeld' property to each answer
                const questionsWithAnswers = results.map(question => {
                    const answers = shuffleArray([question.correct_answer, ...question.incorrect_answers]).map(answer => ({
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

    useEffect(() =>{
        // check if all questions have a selected answer
        // 'every' returns true if all questions satisfy the condition inside the callback function
        // 'some' returns true if at least one answer in a question has 'isHeld' as true
        const allQstnsAnswered = questions.every(question =>
            question.answers.some(answer => answer.isHeld));
        if (allQstnsAnswered){
            setQuizFinished(true)
        }
        else{
            setQuizFinished(false)
        }
    }, [questions, setQuizFinished])

    // function to shuffle the answers for each question so that the correct answer is not always the first one
    //Fisher-Yates 
    function shuffleArray(array) {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

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

    function handlePlayAgain(){
        setQuizFinished(false);
        navigate("/");
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
                                    className={`
                                        ${answer.isHeld ? "answer-held" : "answer"}
                                        ${checkClicked && answer.isHeld && answer.answer === question.correct_answer ? "answer-correct" : ""}
                                        ${checkClicked && answer.isHeld && answer.answer !== question.correct_answer ? "answer-incorrect" : ""}
                                        ${checkClicked && answer.answer === question.correct_answer ? "answer-correct" : ""}
                                        ${checkClicked ? "answer-disabled" : ""}
                                        `}
                                    onClick={() => handleClick(questionIndex, answerIndex)}
                                >
                                    {decodeHTMLEntities(answer.answer)}
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
            <h3 className={quizFinished && checkClicked ? "res-display" : "res-hidden"}>You got {correctAnswers}/{questions.length} questions correct</h3>
            <button 
                className={quizFinished ? "finished-button" : "play-button"}
                onClick={() => {
                    if (quizFinished && checkClicked) {
                        handlePlayAgain();
                    } else {
                        let correct = 0;
                        questions.forEach((question) => {
                            question.answers.forEach((answer) =>{
                                if(answer.isHeld && answer.answer === question.correct_answer){
                                    correct ++;
                                }
                            });
                        });
                        setCorrectAnswers(correct);
                        setCheckClicked(true);
                    }
                }}
            >
                {quizFinished && checkClicked ? "Play again" : "Check answers"}
            </button>
            <a href="https://github.com/fraciah?tab=repositories" className="tag" target="blank" rel="noopener noreferrer">Crafted with 💖 by Fraciah</a>
        </div>
    )
}

Questions.propTypes = {
    quizFinished: PropTypes.bool.isRequired,
    setQuizFinished: PropTypes.func.isRequired
}
